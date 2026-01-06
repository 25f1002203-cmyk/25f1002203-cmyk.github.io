/**
 * app.js - Main application logic for flashcard dashboard/home page
 * Handles deck creation, display, and management
 */

// Get DOM elements
const deckNameInput = document.getElementById('deckNameInput');
const createDeckBtn = document.getElementById('createDeckBtn');
const decksList = document.getElementById('decksList');
const confirmModal = document.getElementById('confirmModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmMessage = document.getElementById('confirmMessage');

let deckToDelete = null;

/**
 * Initialize the app on page load
 */
function init() {
    renderDecks();
    setupEventListeners();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    createDeckBtn.addEventListener('click', handleCreateDeck);
    deckNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleCreateDeck();
        }
    });
    confirmBtn.addEventListener('click', confirmDelete);
    cancelBtn.addEventListener('click', closeConfirmModal);
}

/**
 * Handle create deck button click
 */
function handleCreateDeck() {
    const deckName = deckNameInput.value.trim();
    
    if (!deckName) {
        alert('Please enter a deck name');
        return;
    }

    StorageManager.createDeck(deckName);
    deckNameInput.value = '';
    deckNameInput.focus();
    renderDecks();
}

/**
 * Render all decks on the page
 */
function renderDecks() {
    const decks = StorageManager.getDecks();
    
    if (!decks || decks.length === 0) {
        decksList.innerHTML = '<div class="empty-state"><p>No decks yet. Create one to get started! 🚀</p></div>';
        return;
    }

    decksList.innerHTML = decks.map(deck => createDeckCard(deck)).join('');
    
    // Attach event listeners to deck cards
    decks.forEach(deck => {
        const editBtn = document.getElementById(`edit-${deck.id}`);
        const studyBtn = document.getElementById(`study-${deck.id}`);
        const deleteBtn = document.getElementById(`delete-${deck.id}`);

        if (editBtn) editBtn.addEventListener('click', () => editDeck(deck.id));
        if (studyBtn) studyBtn.addEventListener('click', () => studyDeck(deck.id));
        if (deleteBtn) deleteBtn.addEventListener('click', () => openConfirmModal(deck.id, deck.name));
    });
}

/**
 * Create HTML for a single deck card
 * @param {Object} deck - The deck object
 * @returns {String} HTML string for the deck card
 */
function createDeckCard(deck) {
    const cardCount = deck.cards.length;
    const stats = StorageManager.getStats(deck.id);
    
    return `
        <div class="deck-card">
            <div class="deck-name">📚 ${deck.name}</div>
            <div class="deck-stats">
                <p>${cardCount} card${cardCount !== 1 ? 's' : ''}</p>
                <p style="font-size: 0.85rem; margin-top: 5px;">
                    ✅ ${stats.known} • ⚠️ ${stats.review} • ❌ ${stats.unknown}
                </p>
            </div>
            <div class="deck-actions">
                <button id="edit-${deck.id}" class="btn btn-secondary">✏️ Edit</button>
                <button id="study-${deck.id}" class="btn btn-primary">📖 Study</button>
                <button id="delete-${deck.id}" class="btn btn-danger">🗑️</button>
            </div>
        </div>
    `;
}

/**
 * Navigate to edit/create cards page for a deck
 * @param {String} deckId - The ID of the deck to edit
 */
function editDeck(deckId) {
    // Store the deck ID in sessionStorage so the create page can access it
    sessionStorage.setItem('currentDeckId', deckId);
    window.location.href = 'create.html';
}

/**
 * Navigate to study mode for a deck
 * @param {String} deckId - The ID of the deck to study
 */
function studyDeck(deckId) {
    const deck = StorageManager.getDeck(deckId);
    if (deck.cards.length === 0) {
        alert('No cards in this deck yet. Add some cards first!');
        editDeck(deckId);
        return;
    }
    sessionStorage.setItem('currentDeckId', deckId);
    window.location.href = 'study.html';
}

/**
 * Open confirmation modal for deletion
 * @param {String} deckId - The ID of the deck to delete
 * @param {String} deckName - The name of the deck
 */
function openConfirmModal(deckId, deckName) {
    deckToDelete = deckId;
    confirmMessage.textContent = `Are you sure you want to delete "${deckName}" and all its cards? This action cannot be undone.`;
    confirmModal.classList.remove('hidden');
}

/**
 * Close confirmation modal
 */
function closeConfirmModal() {
    confirmModal.classList.add('hidden');
    deckToDelete = null;
}

/**
 * Confirm and execute deletion
 */
function confirmDelete() {
    if (deckToDelete) {
        StorageManager.deleteDeck(deckToDelete);
        deckToDelete = null;
        closeConfirmModal();
        renderDecks();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
