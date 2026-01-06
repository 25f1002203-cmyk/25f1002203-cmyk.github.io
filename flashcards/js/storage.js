/**
 * Storage.js - Handles all localStorage operations for flashcard system
 * Uses localStorage to persist decks and cards data
 */

const StorageManager = {
    // Key for localStorage
    STORAGE_KEY: 'flashcards_data',

    /**
     * Initialize storage with default data if empty
     */
    init() {
        if (!this.getDecks()) {
            this.saveDecks([]);
        }
    },

    /**
     * Get all decks from localStorage
     * @returns {Array} Array of deck objects
     */
    getDecks() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    /**
     * Save all decks to localStorage
     * @param {Array} decks - Array of deck objects to save
     */
    saveDecks(decks) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(decks));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    },

    /**
     * Get a specific deck by ID
     * @param {String} deckId - The ID of the deck to retrieve
     * @returns {Object} Deck object or null if not found
     */
    getDeck(deckId) {
        const decks = this.getDecks();
        return decks ? decks.find(d => d.id === deckId) : null;
    },

    /**
     * Create a new deck
     * @param {String} name - Name of the new deck
     * @returns {Object} The newly created deck
     */
    createDeck(name) {
        const decks = this.getDecks();
        const newDeck = {
            id: `deck-${Date.now()}`,
            name: name,
            createdAt: new Date().toISOString(),
            cards: []
        };
        decks.push(newDeck);
        this.saveDecks(decks);
        return newDeck;
    },

    /**
     * Delete a deck
     * @param {String} deckId - The ID of the deck to delete
     */
    deleteDeck(deckId) {
        const decks = this.getDecks();
        const filtered = decks.filter(d => d.id !== deckId);
        this.saveDecks(filtered);
    },

    /**
     * Update a deck name
     * @param {String} deckId - The ID of the deck
     * @param {String} newName - The new name for the deck
     */
    updateDeckName(deckId, newName) {
        const decks = this.getDecks();
        const deck = decks.find(d => d.id === deckId);
        if (deck) {
            deck.name = newName;
            this.saveDecks(decks);
        }
    },

    /**
     * Add a new card to a deck
     * @param {String} deckId - The ID of the deck
     * @param {String} front - The front/question content
     * @param {String} back - The back/answer content
     * @returns {Object} The newly created card
     */
    addCard(deckId, front, back) {
        const decks = this.getDecks();
        const deck = decks.find(d => d.id === deckId);
        
        if (deck) {
            const newCard = {
                id: `card-${Date.now()}`,
                front: front,
                back: back,
                status: 'unknown', // 'unknown', 'review', 'known'
                createdAt: new Date().toISOString()
            };
            deck.cards.push(newCard);
            this.saveDecks(decks);
            return newCard;
        }
        return null;
    },

    /**
     * Get all cards in a deck
     * @param {String} deckId - The ID of the deck
     * @returns {Array} Array of card objects
     */
    getCards(deckId) {
        const deck = this.getDeck(deckId);
        return deck ? deck.cards : [];
    },

    /**
     * Get a specific card
     * @param {String} deckId - The ID of the deck
     * @param {String} cardId - The ID of the card
     * @returns {Object} Card object or null if not found
     */
    getCard(deckId, cardId) {
        const cards = this.getCards(deckId);
        return cards.find(c => c.id === cardId);
    },

    /**
     * Update a card
     * @param {String} deckId - The ID of the deck
     * @param {String} cardId - The ID of the card
     * @param {String} front - New front content
     * @param {String} back - New back content
     */
    updateCard(deckId, cardId, front, back) {
        const decks = this.getDecks();
        const deck = decks.find(d => d.id === deckId);
        
        if (deck) {
            const card = deck.cards.find(c => c.id === cardId);
            if (card) {
                card.front = front;
                card.back = back;
                this.saveDecks(decks);
            }
        }
    },

    /**
     * Delete a card from a deck
     * @param {String} deckId - The ID of the deck
     * @param {String} cardId - The ID of the card to delete
     */
    deleteCard(deckId, cardId) {
        const decks = this.getDecks();
        const deck = decks.find(d => d.id === deckId);
        
        if (deck) {
            deck.cards = deck.cards.filter(c => c.id !== cardId);
            this.saveDecks(decks);
        }
    },

    /**
     * Update card status (unknown, review, known)
     * @param {String} deckId - The ID of the deck
     * @param {String} cardId - The ID of the card
     * @param {String} status - New status value
     */
    updateCardStatus(deckId, cardId, status) {
        const decks = this.getDecks();
        const deck = decks.find(d => d.id === deckId);
        
        if (deck) {
            const card = deck.cards.find(c => c.id === cardId);
            if (card) {
                card.status = status;
                this.saveDecks(decks);
            }
        }
    },

    /**
     * Get card statistics for a deck
     * @param {String} deckId - The ID of the deck
     * @returns {Object} Statistics object
     */
    getStats(deckId) {
        const cards = this.getCards(deckId);
        return {
            total: cards.length,
            known: cards.filter(c => c.status === 'known').length,
            review: cards.filter(c => c.status === 'review').length,
            unknown: cards.filter(c => c.status === 'unknown').length
        };
    },

    /**
     * Export all data as JSON
     * @returns {String} JSON string of all data
     */
    exportData() {
        return JSON.stringify(this.getDecks(), null, 2);
    },

    /**
     * Import data from JSON
     * @param {String} jsonData - JSON string to import
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (Array.isArray(data)) {
                this.saveDecks(data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    /**
     * Clear all data
     */
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.init();
    }
};

// Initialize storage on load
if (typeof window !== 'undefined') {
    StorageManager.init();
}
