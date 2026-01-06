/**
 * create.js - Handles creating and editing flashcards
 */

let currentDeckId = sessionStorage.getItem('currentDeckId');
let editingCardId = null;
let allCards = [];

// Get DOM elements
const pageTitle = document.getElementById('pageTitle');
const cardForm = document.getElementById('cardForm');
const frontInput = document.getElementById('frontInput');
const backInput = document.getElementById('backInput');
const cardsList = document.getElementById('cardsList');
const cardCount = document.getElementById('cardCount');
const studyBtn = document.getElementById('studyBtn');
const editModal = document.getElementById('editModal');
const editFront = document.getElementById('editFront');
const editBack = document.getElementById('editBack');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmMessage = document.getElementById('confirmMessage');

let cardToDelete = null;

/**
 * Initialize the page
 */
function init() {
    if (!currentDeckId) {
        alert('No deck selected');
        window.location.href = 'index.html';
        return;
    }

    const deck = StorageManager.getDeck(currentDeckId);
    if (!deck) {
        alert('Deck not found');
        window.location.href = 'index.html';
        return;
    }

    pageTitle.textContent = `Add Cards to ${deck.name}`;
    allCards = [...deck.cards];
    
    renderCards();
    setupEventListeners();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    cardForm.addEventListener('submit', handleAddCard);
    studyBtn.addEventListener('click', handleStudy);
    saveEditBtn.addEventListener('click', saveEdit);
    cancelEditBtn.addEventListener('click', closeEditModal);
    confirmBtn.addEventListener('click', confirmDelete);
    cancelBtn.addEventListener('click', closeConfirmModal);
}

/**
 * Handle form submission to add new card
 * @param {Event} e - Form submission event
 */
function handleAddCard(e) {
    e.preventDefault();

    const front = frontInput.value.trim();
    const back = backInput.value.trim();

    if (!front || !back) {
        alert('Please fill in both question and answer');
        return;
    }

    const newCard = StorageManager.addCard(currentDeckId, front, back);
    allCards.push(newCard);
    
    frontInput.value = '';
    backInput.value = '';
    frontInput.focus();
    
    renderCards();
}

/**
 * Render all cards in the list
 */
function renderCards() {
    cardCount.textContent = `${allCards.length} card${allCards.length !== 1 ? 's' : ''}`;
    
    if (allCards.length === 0) {
        cardsList.innerHTML = '<div class="empty-state"><p>No cards yet. Add your first card! 🌟</p></div>';
        return;
    }

    cardsList.innerHTML = allCards.map(card => createCardItem(card)).join('');
    
    // Attach event listeners
    allCards.forEach(card => {
        const editBtn = document.getElementById(`edit-${card.id}`);
        const deleteBtn = document.getElementById(`delete-${card.id}`);
        
        if (editBtn) editBtn.addEventListener('click', () => openEditModal(card.id));
        if (deleteBtn) deleteBtn.addEventListener('click', () => openConfirmModal(card.id));
    });
}

/**
 * Create HTML for a single card item
 * @param {Object} card - The card object
 * @returns {String} HTML string for the card
 */
function createCardItem(card) {
    return `
        <div class="card-item">
            <div class="card-item-front">📱 ${escapeHtml(card.front)}</div>
            <div class="card-item-back">${escapeHtml(card.back)}</div>
            <div class="card-item-actions">
                <button id="edit-${card.id}" class="btn btn-secondary">퉰f️ Edit</button>
                <button id="delete-${card.id}" class="btn btn-danger">🗑️ Delete</button>
            </div>
        </div>
    `;
}

/**
 * Open edit modal for a card
 * @param {String} cardId - The ID of the card to edit
 */
function openEditModal(cardId) {
    editingCardId = cardId;
    const card = allCards.find(c => c.id === cardId);
    
    if (card) {
        editFront.value = card.front;
        editBack.value = card.back;
        editModal.classList.remove('hidden');
        editFront.focus();
    }
}

/**
 * Close edit modal
 */
function closeEditModal() {
    editModal.classList.add('hidden');
    editingCardId = null;
    editFront.value = '';
    editBack.value = '';
}

/**
 * Save edited card
 */
function saveEdit() {
    const front = editFront.value.trim();
    const back = editBack.value.trim();

    if (!front || !back) {
        alert('Please fill in both question and answer');
        return;
    }

    StorageManager.updateCard(currentDeckId, editingCardId, front, back);
    
    // Update local array
    const card = allCards.find(c => c.id === editingCardId);
    if (card) {
        card.front = front;
        card.back = back;
    }

    closeEditModal();
    renderCards();
}

/**
 * Open confirmation modal for deletion
 * @param {String} cardId - The ID of the card to delete
 */
function openConfirmModal(cardId) {
    cardToDelete = cardId;
    const card = allCards.find(c => c.id === cardId);
    confirmMessage.textContent = `Delete card: "${card.front}"?`;
    confirmModal.classList.remove('hidden');
}

/**
 * Close confirmation modal
 */
function closeConfirmModal() {
    confirmModal.classList.add('hidden');
    cardToDelete = null;
}

/**
 * Confirm and execute card deletion
 */
function confirmDelete() {
    if (cardToDelete) {
        StorageManager.deleteCard(currentDeckId, cardToDelete);
        allCards = allCards.filter(c => c.id !== cardToDelete);
        cardToDelete = null;
        closeConfirmModal();
        renderCards();
    }
}

/**
 * Handle study button click
 */
function handleStudy() {
    if (allCards.length === 0) {
        alert('Add some cards first!');
        return;
    }
    sessionStorage.setItem('currentDeckId', currentDeckId);
    window.location.href = 'study.html';
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {String} text - The text to escape
 * @returns {String} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
