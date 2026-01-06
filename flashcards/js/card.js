/**
 * card.js - Handles study mode, card flipping, and navigation
 */

let currentDeckId = sessionStorage.getItem('currentDeckId');
let currentCards = [];
let currentIndex = 0;
let cardStats = { known: 0, review: 0, unknown: 0 };

// Get DOM elements
const deckTitle = document.getElementById('deckTitle');
const flashcard = document.getElementById('flashcard');
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const cardCounter = document.getElementById('cardCounter');
const progressFill = document.getElementById('progressFill');
const shuffleBtn = document.getElementById('shuffleBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const unknownBtn = document.getElementById('unknownBtn');
const reviewBtn = document.getElementById('reviewBtn');
const knownBtn = document.getElementById('knownBtn');
const statKnown = document.getElementById('statKnown');
const statReview = document.getElementById('statReview');
const statUnknown = document.getElementById('statUnknown');

/**
 * Initialize study mode
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

    deckTitle.textContent = deck.name;
    currentCards = [...deck.cards];
    
    // Initialize stats
    updateStats();
    displayCard();
    setupEventListeners();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    flashcard.addEventListener('click', flipCard);
    shuffleBtn.addEventListener('click', shuffleCards);
    prevBtn.addEventListener('click', previousCard);
    nextBtn.addEventListener('click', nextCard);
    unknownBtn.addEventListener('click', () => markCard('unknown'));
    reviewBtn.addEventListener('click', () => markCard('review'));
    knownBtn.addEventListener('click', () => markCard('known'));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            flipCard();
        }
        if (e.code === 'ArrowLeft') previousCard();
        if (e.code === 'ArrowRight') nextCard();
    });
}

/**
 * Display current card
 */
function displayCard() {
    if (currentCards.length === 0) {
        cardFront.textContent = 'No cards in this deck';
        cardBack.textContent = 'Add cards to get started';
        return;
    }

    const card = currentCards[currentIndex];
    cardFront.textContent = card.front;
    cardBack.textContent = card.back;
    flashcard.classList.remove('flipped');

    // Update counter and progress
    cardCounter.textContent = `Card ${currentIndex + 1} of ${currentCards.length}`;
    const progress = ((currentIndex + 1) / currentCards.length) * 100;
    progressFill.style.width = progress + '%';

    // Reset status buttons
    updateStatusButtons();
}

/**
 * Flip the card
 */
function flipCard() {
    flashcard.classList.toggle('flipped');
}

/**
 * Navigate to previous card
 */
function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        displayCard();
    }
}

/**
 * Navigate to next card
 */
function nextCard() {
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        displayCard();
    }
}

/**
 * Mark card with a status and move to next
 * @param {String} status - The status to set ('unknown', 'review', 'known')
 */
function markCard(status) {
    const card = currentCards[currentIndex];
    StorageManager.updateCardStatus(currentDeckId, card.id, status);
    card.status = status;
    updateStats();
    
    // Move to next card if available, otherwise stay on last
    if (currentIndex < currentCards.length - 1) {
        nextCard();
    }
}

/**
 * Update the visual state of status buttons
 */
function updateStatusButtons() {
    const card = currentCards[currentIndex];
    
    unknownBtn.classList.remove('active');
    reviewBtn.classList.remove('active');
    knownBtn.classList.remove('active');

    if (card.status === 'unknown') unknownBtn.classList.add('active');
    if (card.status === 'review') reviewBtn.classList.add('active');
    if (card.status === 'known') knownBtn.classList.add('active');
}

/**
 * Update statistics display
 */
function updateStats() {
    cardStats = {
        known: currentCards.filter(c => c.status === 'known').length,
        review: currentCards.filter(c => c.status === 'review').length,
        unknown: currentCards.filter(c => c.status === 'unknown').length
    };

    statKnown.textContent = cardStats.known;
    statReview.textContent = cardStats.review;
    statUnknown.textContent = cardStats.unknown;
}

/**
 * Shuffle cards and restart
 */
function shuffleCards() {
    // Fisher-Yates shuffle algorithm
    for (let i = currentCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
    }
    currentIndex = 0;
    displayCard();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
