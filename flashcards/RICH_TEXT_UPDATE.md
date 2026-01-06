# Rich Text Formatting Update

## 🌟 What's New

Your flashcard system now supports **rich text formatting** with markdown syntax! Create beautiful flashcards with:

### New Features Added

1. **✨ Markdown Formatting**
   - Bold, italic, code, lists, links
   - Code blocks for technical content
   - Headings and horizontal lines

2. **📕 Editor Toolbar**
   - One-click formatting buttons
   - Keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic)
   - Character counter (5000 char limit)
   - Live preview toggle

3. **👀 Rich Display**
   - Markdown renders beautifully on study cards
   - Syntax highlighting for code blocks
   - Proper formatting in card lists

## 📝 Supported Markdown Syntax

### Text Formatting
```
**bold text**              → Bold
*italic text*              → Italic
`inline code`              → Inline code
```

### Code Blocks
```
```
function hello() {
  console.log('Hello!');
}
```
```
Will render as a formatted code block with syntax highlighting.

### Lists
```
- Item 1
- Item 2
- Item 3

1. First item
2. Second item
3. Third item
```

### Links
```
[Click here](https://example.com)
```

### Headings
```
# Heading 1
## Heading 2
### Heading 3
```

### Horizontal Line
```
---
```

## 🌠 Example: Decorator Fundamentals

Here's how to create your decorator flashcards with rich formatting:

### Flash Card 1: Core Concept

**Front:**
```
What is a Python decorator and what problem does it solve?
```

**Back:**
```
**Definition:** A decorator is a function that takes another function and extends its behavior without permanently modifying it.

**Problem it solves:** Adding cross-cutting concerns (logging, timing, caching, validation) without cluttering business logic.

**Key mechanism:** Uses closures—inner functions that "remember" variables from their enclosing scope.

**Visual memory:** 🎁 A gift wrapper that adds features while keeping the gift inside unchanged.
```

### Flash Card 2: Basic Syntax Pattern

**Front:**
```
Write the skeleton code for a basic decorator. What are the 3 essential parts?
```

**Back:**
```
```python
def my_decorator(func):              # 1. Outer function (takes function)
    def wrapper(*args, **kwargs):     # 2. Inner function (closure)
        # Do something before
        result = func(*args, **kwargs)  # Call original
        # Do something after
        return result                 # 3. Return result
    return wrapper                    # Return wrapper function
```

# Usage:
```python
@my_decorator
def my_function():
    pass
```

**Is equivalent to:**
```python
my_function = my_decorator(my_function)
```

**Memory trigger:** "Take → Wrap → Return"

**Critical detail:** `*args, **kwargs` makes it work with ANY function signature
```

### Flash Card 3: Common Gotcha

**Front:**
```
What metadata does a decorated function lose, and how do you fix it?
```

**Back:**
```
**Problem:** The decorated function loses its original name, docstring, and other metadata:

```python
def timer(func):
    def wrapper(*args, **kwargs):
        # timing code
        return func(*args, **kwargs)
    return wrapper

@timer
def calculate(x):
    """Does calculation"""
    return x * 2

print(calculate.__name__)  # Prints: "wrapper" ❌
print(calculate.__doc__)   # Prints: None ❌
```

**Solution:** Use `@functools.wraps`:

```python
import functools

def timer(func):
    @functools.wraps(func)  # ← This fixes it
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@timer
def calculate(x):
    """Does calculation"""
    return x * 2

print(calculate.__name__)  # Prints: "calculate" ✅
print(calculate.__doc__)   # Prints: "Does calculation" ✅
```

**Interview signal:** Knowing this shows production experience—debugging becomes impossible without proper metadata.

**Memory trigger:** "Wrap the wrapper with @functools.wraps"
```

## 🎨 Editor Toolbar Buttons

When creating or editing cards, you'll see these toolbar buttons:

| Button | Action | Keyboard Shortcut |
|--------|--------|-------------------|
| **B** | Bold text | Ctrl+B / Cmd+B |
| *I* | Italic text | Ctrl+I / Cmd+I |
| `<code>` | Code formatting | - |
| • List | Bullet list | - |
| 1. List | Numbered list | - |
| 🔗 Link | Add link | - |

## 👁 Preview Mode

1. **While Editing:** Click the "👁️ Preview" button to see how your markdown will render
2. **In Card List:** Click the preview icon to toggle between text and rendered view
3. **During Study:** Formatted content displays automatically with proper styling

## 📄 Files Modified

### New Files
- `js/markdown.js` - Markdown parser (converts markdown to HTML)
- `js/editor.js` - Editor toolbar functionality
- `css/editor.css` - Editor and preview styling
- `RICH_TEXT_UPDATE.md` - This file

### Updated Files
- `create.html` - Added editor toolbar and preview
- `study.html` - Changed to render markdown content
- `create.js` - Added markdown rendering in card lists
- `card.js` - Added markdown rendering in study cards

## 🚀 How to Use

### Creating a Card with Formatting

1. Go to "Create/Edit Cards" for your deck
2. Fill in the "Question/Front" field
3. Use toolbar buttons or type markdown directly:
   - Type `**bold**` for bold
   - Type `*italic*` for italic
   - Wrap code in backticks: `code`
4. Click "👁️ Preview" to see formatted result
5. Fill in the "Answer/Back" field with formatting
6. Click "+ Add Card" to save

### Studying with Formatted Cards

1. Click "Study This Deck"
2. View the formatted question and answer
3. All markdown formatting renders automatically
4. Code blocks show with syntax highlighting
5. Lists display properly with bullets or numbers

## 🕺️ Formatting Tips

### For Code Examples
```
Use triple backticks to create code blocks:

```javascript
function example() {
  return 'formatted';
}
```
```

### For Complex Content
```
**Key Points:**
1. First important point
2. Second important point
3. Third important point

**Formula:** `E = mc²`

**More info:** [Link text](https://url.com)
```

### For Q&A Pairs
```
**Q: What is recursion?**

A: A function that calls itself until a base case is reached.

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```
```

## 🔍 Troubleshooting

### Formatting not showing up?
- Make sure you're using correct markdown syntax
- Check the preview to verify formatting
- Reload the page if content doesn't display

### Preview not updating?
- Click the preview button again
- Make sure you're typing valid markdown
- Check browser console (F12) for any errors

### Character limit exceeded?
- Each card front/back is limited to 5000 characters
- Check the character counter in the toolbar
- Split content into multiple cards if needed

## 💾 Data Compatibility

- **Markdown is stored as plain text** in localStorage
- Old cards without formatting still work fine
- You can mix formatted and plain text cards
- Export/import maintains markdown content

## 🙋 Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support (toolbar adapts to mobile)

## 🔓 Advanced: Custom Styling

To customize markdown rendering, edit `css/editor.css`:

```css
.markdown-content strong {
    color: var(--primary-color);
    font-weight: 700;
}
```

## 🚀 What's Coming Next?

Potential future enhancements:
- [ ] Image uploading and embedding
- [ ] LaTeX math equation support
- [ ] Syntax highlighting for more languages
- [ ] Table support
- [ ] Emoji picker
- [ ] Custom color highlighting

---

**Enjoy creating beautiful, well-formatted flashcards! 🙋✨**
