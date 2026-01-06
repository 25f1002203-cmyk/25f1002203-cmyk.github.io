# 📚 Flashcard Manager - Study Smarter

A lightweight, interactive flashcard management system built with vanilla JavaScript and GitHub Pages. Perfect for studying languages, concepts, formulas, and more.

## 🌟 Features

### Core Functionality
- ✅ **Create Multiple Decks** - Organize flashcards into separate study sets
- ✅ **Add/Edit/Delete Cards** - Manage individual flashcards with front (question) and back (answer)
- ✅ **Interactive Card Flipping** - Click or press spacebar to reveal answers with smooth 3D animation
- ✅ **Study Mode** - Navigate through cards with previous/next buttons
- ✅ **Progress Tracking** - Mark cards as "Know", "Review", or "Don't Know"
- ✅ **Shuffle Mode** - Randomize card order for better retention
- ✅ **Statistics Dashboard** - View deck stats and study progress
- ✅ **Keyboard Shortcuts** - Navigate hands-free
- ✅ **Local Storage** - Persists all data in browser (no account needed)
- ✅ **Responsive Design** - Works perfectly on mobile and desktop
- ✅ **Beautiful UI** - Modern gradient design with smooth animations

## 🚀 Quick Start

### 1. Access the Application

The flashcard system is available at:
```
https://seenivasan.me/flashcards/
```

### 2. Create Your First Deck

1. Go to the home page (`index.html`)
2. Enter a deck name (e.g., "Linear Algebra", "Spanish Vocab")
3. Click "Create Deck" button
4. Your deck will appear in the grid below

### 3. Add Flashcards

1. Click the "Edit" button on your deck
2. Fill in the Question (front) and Answer (back)
3. Click "+ Add Card" to add it to the deck
4. Repeat for as many cards as you need
5. Cards will appear in the list below the form

### 4. Study Your Cards

1. Click "Study This Deck" button or the "Study" button on a deck card
2. Click on the flashcard to flip and see the answer
3. Use buttons to mark: 
   - ✅ **Know** - You've mastered this
   - ⚠️ **Review** - Needs more practice
   - ❌ **Don't Know** - Focus on this one
4. Use arrow keys or buttons to navigate
5. Click shuffle to randomize order

## 💫 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `SPACEBAR` | Flip card |
| `→ (Right Arrow)` | Next card |
| `← (Left Arrow)` | Previous card |

## 📁 File Structure

```
flashcards/
├── index.html           # Home page / Deck management
├── study.html           # Study mode interface
├── create.html          # Add/edit cards interface
├── css/
│   └── styles.css       # Complete styling (12.5KB)
├── js/
│   ├── storage.js       # localStorage management (7KB)
│   ├── app.js           # Dashboard logic (5KB)
│   ├── card.js          # Study mode logic (5.3KB)
│   └── create.js        # Card management logic (6.7KB)
└── README.md            # This file
```

## 💾 Data Storage

All data is stored in your browser's **localStorage** with the key `flashcards_data`.

### Data Structure
```javascript
{
  "decks": [
    {
      "id": "deck-1234567890",
      "name": "Linear Algebra",
      "createdAt": "2026-01-06T11:15:00.000Z",
      "cards": [
        {
          "id": "card-1234567890",
          "front": "What is a vector space?",
          "back": "A set with addition and scalar multiplication...",
          "status": "unknown",
          "createdAt": "2026-01-06T11:15:30.000Z"
        }
      ]
    }
  ]
}
```

**Card Status Values:**
- `unknown` - Not yet studied
- `review` - Needs more practice
- `known` - Mastered

## 🎨 Customization

### Change Colors
Edit `css/styles.css` and modify the CSS custom properties in `:root`:

```css
:root {
    --primary-color: #5e72e4;      /* Main blue */
    --success-color: #2dce89;      /* Green for "Know" */
    --warning-color: #fb6340;      /* Orange for "Review" */
    --danger-color: #f5365c;       /* Red for "Don't Know" */
    /* ... more colors ... */
}
```

### Adjust Card Size
In `css/styles.css`, modify the flashcard height:

```css
.flashcard {
    width: 100%;
    height: 300px;  /* Change this value */
}
```

## 🔧 Technical Details

### Browser Compatibility
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Dependencies
**None!** Pure vanilla JavaScript, HTML, and CSS.

### Performance
- Lightweight: ~25KB total (gzipped)
- No external libraries or CDN dependencies
- Works offline once loaded
- Smooth animations at 60fps

## 🗑️ Local Storage Limits

Browser localStorage typically allows **5-10MB** of data:
- ~50,000 cards before reaching limits
- Perfect for any reasonable study needs

If you hit limits:
1. Delete unused decks
2. Export important decks first
3. Start fresh by clearing all data

## 💾 Backup Your Data

### Manual Export
1. Open browser DevTools (`F12`)
2. Go to Console tab
3. Run: `console.log(localStorage.getItem('flashcards_data'))`
4. Copy the output and save it
5. Use this JSON to restore if needed

### Browser Storage
Data is tied to your browser/domain:
- Different browsers = different data
- Clearing browser data = data lost
- Incognito mode doesn't persist data

## 🚧 Troubleshooting

### Cards not saving?
- Check if localStorage is enabled in your browser
- Try clearing cache and reloading
- Check browser console for errors (F12)

### Animations not smooth?
- Update your browser to the latest version
- Disable browser extensions
- Check system performance

### Data disappeared?
- Check if using incognito/private browsing
- Browser storage may have been cleared
- Try a different browser to see if data exists

## 🎨 Design System

### Colors
- **Primary**: `#5e72e4` (Purple-Blue)
- **Success**: `#2dce89` (Green)
- **Warning**: `#fb6340` (Orange)
- **Danger**: `#f5365c` (Red)
- **Background**: Gradient (Purple to Pink)

### Spacing
- Uses 8px base unit
- Consistent padding/margins
- Responsive breakpoints at 768px

### Typography
- Primary: System fonts (-apple-system, Segoe UI, sans-serif)
- Responsive sizing (mobile-optimized)

## 🙋 Contributing

To extend or modify:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** to HTML/CSS/JS files
4. **Test thoroughly** on mobile and desktop
5. **Commit and push**: `git commit -m "Add feature"`
6. **Create Pull Request**

### Suggested Enhancements
- [ ] Spaced repetition algorithm (SM-2)
- [ ] Export/import decks as CSV
- [ ] Audio pronunciation support
- [ ] Image support for cards
- [ ] Dark mode toggle
- [ ] Keyboard customization
- [ ] Study timer/session tracking
- [ ] Cloud sync with backend

## 📄 License

MIT License - Feel free to use for personal, educational, or commercial projects.

## 🙏 Credits

Built with ❤️ using vanilla web technologies.

---

**Happy studying! 🚀📚**

Questions or suggestions? Check the main repository or open an issue.
