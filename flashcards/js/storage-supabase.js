/**
 * Hybrid Storage Manager - localStorage + Supabase
 * Provides immediate local sync with background Supabase persistence
 */

const HybridStorageManager = {
    // Configuration
    STORAGE_KEY: 'flashcards_data',
    SYNC_TIMEOUT: 5000, // 5 seconds to attempt sync
    syncInProgress: false,
    syncStatus: 'idle', // 'idle', 'syncing', 'success', 'error'
    lastSyncTime: null,

    /**
     * Initialize storage - load from localStorage or Supabase
     */
    async init() {
        try {
            // First, check if localStorage has data
            const localData = this.getLocalDecks();
            
            if (localData && localData.length > 0) {
                console.log('✅ Loaded from localStorage');
                // Try to sync with Supabase in background
                this.syncToSupabase();
            } else {
                // Try to load from Supabase
                const supabaseData = await this.loadFromSupabase();
                if (supabaseData) {
                    this.saveLocalDecks(supabaseData);
                    console.log('✅ Loaded from Supabase');
                } else {
                    // Initialize empty
                    this.saveLocalDecks([]);
                    console.log('✅ Initialized empty storage');
                }
            }
        } catch (error) {
            console.error('Error initializing storage:', error);
            // Fallback to empty
            if (!this.getLocalDecks()) {
                this.saveLocalDecks([]);
            }
        }
    },

    // ========================================
    // LOCAL STORAGE (Primary)
    // ========================================

    /**
     * Get all decks from localStorage
     */
    getLocalDecks() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return null;
        }
    },

    /**
     * Save all decks to localStorage
     */
    saveLocalDecks(decks) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(decks));
            // Trigger sync to Supabase
            this.syncToSupabase();
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // ========================================
    // SUPABASE OPERATIONS (Cloud)
    // ========================================

    /**
     * Load all decks from Supabase
     */
    async loadFromSupabase() {
        try {
            const decks = await supabase.select('decks');
            if (!Array.isArray(decks)) return null;

            // Load cards for each deck
            const decksWithCards = await Promise.all(
                decks.map(async (deck) => {
                    const cards = await supabase.select(
                        'cards',
                        `?deck_id=eq.${deck.id}`
                    );
                    return {
                        ...deck,
                        cards: Array.isArray(cards) ? cards : []
                    };
                })
            );

            return decksWithCards;
        } catch (error) {
            console.error('Error loading from Supabase:', error);
            return null;
        }
    },

    /**
     * Sync local data to Supabase
     */
    async syncToSupabase() {
        if (this.syncInProgress) return;
        
        this.syncInProgress = true;
        this.updateSyncStatus('syncing');

        try {
            const localDecks = this.getLocalDecks();
            if (!localDecks) return;

            // Get existing decks from Supabase
            const supabaseDecks = await supabase.select('decks');
            const supabaseDeckMap = new Map(
                supabaseDecks.map(d => [d.id, d])
            );

            // Sync each local deck
            for (const localDeck of localDecks) {
                if (supabaseDeckMap.has(localDeck.id)) {
                    // Update existing deck
                    await supabase.update(
                        'decks',
                        `?id=eq.${localDeck.id}`,
                        {
                            name: localDeck.name,
                            updated_at: new Date().toISOString()
                        }
                    );
                } else {
                    // Create new deck
                    await supabase.insert('decks', {
                        id: localDeck.id,
                        name: localDeck.name,
                        created_at: localDeck.createdAt,
                        updated_at: new Date().toISOString()
                    });
                }

                // Sync cards
                const supabaseCards = await supabase.select(
                    'cards',
                    `?deck_id=eq.${localDeck.id}`
                );
                const supabaseCardMap = new Map(
                    supabaseCards.map(c => [c.id, c])
                );

                // Sync each card
                for (const card of localDeck.cards) {
                    if (supabaseCardMap.has(card.id)) {
                        // Update existing card
                        await supabase.update(
                            'cards',
                            `?id=eq.${card.id}`,
                            {
                                front: card.front,
                                back: card.back,
                                status: card.status,
                                updated_at: new Date().toISOString()
                            }
                        );
                    } else {
                        // Create new card
                        await supabase.insert('cards', {
                            id: card.id,
                            deck_id: localDeck.id,
                            front: card.front,
                            back: card.back,
                            status: card.status,
                            created_at: card.createdAt,
                            updated_at: new Date().toISOString()
                        });
                    }
                }
            }

            this.lastSyncTime = new Date();
            this.updateSyncStatus('success');
            console.log('✅ Synced to Supabase');
        } catch (error) {
            console.error('Sync error:', error);
            this.updateSyncStatus('error');
        } finally {
            this.syncInProgress = false;
            // Reset status after 3 seconds
            setTimeout(() => {
                if (this.syncStatus !== 'error') {
                    this.updateSyncStatus('idle');
                }
            }, 3000);
        }
    },

    /**
     * Update sync status UI
     */
    updateSyncStatus(status) {
        this.syncStatus = status;
        const indicator = document.getElementById('syncStatus');
        if (!indicator) return;

        const statusMap = {
            idle: { icon: '✓', color: '#2dce89', text: 'Synced' },
            syncing: { icon: '⟳', color: '#fb6340', text: 'Syncing...' },
            success: { icon: '✓', color: '#2dce89', text: 'Synced' },
            error: { icon: '✗', color: '#f5365c', text: 'Sync failed' }
        };

        const info = statusMap[status] || statusMap.idle;
        indicator.textContent = `${info.icon} ${info.text}`;
        indicator.style.color = info.color;
    },

    // ========================================
    // DECK OPERATIONS
    // ========================================

    getDecks() {
        return this.getLocalDecks();
    },

    getDeck(deckId) {
        const decks = this.getLocalDecks();
        return decks ? decks.find(d => d.id === deckId) : null;
    },

    createDeck(name) {
        const decks = this.getLocalDecks();
        const newDeck = {
            id: `deck-${Date.now()}`,
            name: name,
            createdAt: new Date().toISOString(),
            cards: []
        };
        decks.push(newDeck);
        this.saveLocalDecks(decks);
        return newDeck;
    },

    deleteDeck(deckId) {
        const decks = this.getLocalDecks();
        const filtered = decks.filter(d => d.id !== deckId);
        this.saveLocalDecks(filtered);
        // Also delete from Supabase
        supabase.delete('decks', `?id=eq.${deckId}`).catch(e => 
            console.error('Error deleting from Supabase:', e)
        );
    },

    updateDeckName(deckId, newName) {
        const decks = this.getLocalDecks();
        const deck = decks.find(d => d.id === deckId);
        if (deck) {
            deck.name = newName;
            this.saveLocalDecks(decks);
        }
    },

    // ========================================
    // CARD OPERATIONS
    // ========================================

    getCards(deckId) {
        const deck = this.getDeck(deckId);
        return deck ? deck.cards : [];
    },

    getCard(deckId, cardId) {
        const cards = this.getCards(deckId);
        return cards.find(c => c.id === cardId);
    },

    addCard(deckId, front, back) {
        const decks = this.getLocalDecks();
        const deck = decks.find(d => d.id === deckId);
        
        if (deck) {
            const newCard = {
                id: `card-${Date.now()}`,
                front: front,
                back: back,
                status: 'unknown',
                createdAt: new Date().toISOString()
            };
            deck.cards.push(newCard);
            this.saveLocalDecks(decks);
            return newCard;
        }
        return null;
    },

    updateCard(deckId, cardId, front, back) {
        const decks = this.getLocalDecks();
        const deck = decks.find(d => d.id === deckId);
        
        if (deck) {
            const card = deck.cards.find(c => c.id === cardId);
            if (card) {
                card.front = front;
                card.back = back;
                this.saveLocalDecks(decks);
            }
        }
    },

    deleteCard(deckId, cardId) {
        const decks = this.getLocalDecks();
        const deck = decks.find(d => d.id === deckId);
        
        if (deck) {
            deck.cards = deck.cards.filter(c => c.id !== cardId);
            this.saveLocalDecks(decks);
            // Also delete from Supabase
            supabase.delete('cards', `?id=eq.${cardId}`).catch(e =>
                console.error('Error deleting card from Supabase:', e)
            );
        }
    },

    updateCardStatus(deckId, cardId, status) {
        const decks = this.getLocalDecks();
        const deck = decks.find(d => d.id === deckId);
        
        if (deck) {
            const card = deck.cards.find(c => c.id === cardId);
            if (card) {
                card.status = status;
                this.saveLocalDecks(decks);
            }
        }
    },

    // ========================================
    // DATA MANAGEMENT
    // ========================================

    getStats(deckId) {
        const cards = this.getCards(deckId);
        return {
            total: cards.length,
            known: cards.filter(c => c.status === 'known').length,
            review: cards.filter(c => c.status === 'review').length,
            unknown: cards.filter(c => c.status === 'unknown').length
        };
    },

    exportData() {
        return JSON.stringify(this.getDecks(), null, 2);
    },

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (Array.isArray(data)) {
                this.saveLocalDecks(data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.saveLocalDecks([]);
    }
};

// Use HybridStorageManager as primary storage
const StorageManager = HybridStorageManager;

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        StorageManager.init();
    });
}

console.log('✅ Hybrid Storage Manager loaded');
