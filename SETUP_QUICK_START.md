# 🚀 Quick Start - Supabase Setup (5 minutes)

## 🔐 IMPORTANT: API Key Fix

**If you see this error:**
```
401 Unauthorized
No API key found in request
```

**Solution**: Hard refresh your browser
- **Windows**: `Ctrl+Shift+R`
- **Mac**: `Cmd+Shift+R`

This loads the latest code with the API key fix. See `API_KEY_FIX.md` for details.

---

## Step 1: Create Database Tables (2 minutes)

Open [Supabase SQL Editor](https://cnevpevsnslzowfbfzwe.supabase.co/sql/new)

Copy-paste this SQL:

```sql
-- Create tables
CREATE TABLE decks (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
    id TEXT PRIMARY KEY,
    deck_id TEXT NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unknown',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_cards_deck_id ON cards(deck_id);

-- Enable RLS
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Allow public access
CREATE POLICY "Allow public access" ON decks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access" ON cards FOR ALL USING (true) WITH CHECK (true);
```

Click "Run" button. ✅ Done!

---

## Step 2: Verify Tables (1 minute)

Go to Supabase Dashboard → Tables

You should see:
- ✅ `decks` table with lock icon 🔒
- ✅ `cards` table with lock icon 🔒

---

## Step 3: Test It (2 minutes)

### Hard Refresh First!
```
Ctrl+Shift+R  (Windows)
Cmd+Shift+R   (Mac)
```

### Open the app:
https://seenivasan.me/flashcards/

### Check browser console (F12):
Look for:
```
✅ Supabase connection successful
✅ Loaded from Supabase
```

NOT:
```
❌ No API key found in request
```

### Create a test deck:
1. Enter deck name (e.g., "Test Deck")
2. Click "+ Create Deck"
3. Wait 1 second

### Check sync status (top-right):
Should show: **✅ Synced** (green)

### Verify in Supabase:
1. Go to Supabase Dashboard
2. Click "Tables" → "decks"
3. Your test deck appears?

✅ **Success!** Data is syncing!

---

## Troubleshooting

### Issue: Still seeing 401 error

**Solution 1**: Hard refresh again
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

**Solution 2**: Clear browser cache
- Chrome: Settings → Clear browsing data
- Firefox: Options → Privacy → Clear Data
- Safari: Develop → Empty Caches

**Solution 3**: Check tables exist
1. Supabase → Tables
2. See `decks` and `cards` tables?
3. Both have lock icon?
4. If not, run SQL from Step 1

### Issue: Sync shows 🔴 Error

**Check 1**: Open console (F12)
- What error message?
- Share it for debugging

**Check 2**: Verify RLS policies
1. Supabase → Tables → decks
2. Click "Authentication"
3. See policy "Allow public access"?
4. Is it enabled?

**Check 3**: Test connection manually
```javascript
// In browser console, type:
fetch('https://cnevpevsnslzowfbfzwe.supabase.co/rest/v1/decks', {
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
}).then(r => r.json()).then(d => console.log(d))
```

### Issue: No tables created

**Solution**: Run SQL from Step 1 again
1. Go to Supabase SQL Editor
2. Copy entire SQL block
3. Paste and click Run
4. Check "Output" tab for errors

---

## What's Happening

### Behind the scenes:

```
You create deck
  ↓
💾 Saved to browser (INSTANT)
  ↓
🚀 Syncs to Supabase in background (1-5 sec)
  ↓
✅ Status shows "Synced"
```

### Why this is cool:

✅ **Instant feedback** - No waiting for server

✅ **Works offline** - Internet optional

✅ **Auto backup** - Data in cloud

✅ **Cross-device** - Use on phone/tablet/laptop

✅ **Shareable** - All data is public

---

## Next Steps

### 🎓 Learn the System
Read: `SUPABASE_SETUP_COMPLETE.md`

### 🚀 Use the App
Go to: https://seenivasan.me/flashcards/

### 📚 Create Flashcards
Start studying!

### 💡 Optional: Add Features
Want to add:
- User accounts? (requires authentication)
- Real-time sync? (add Realtime subscriptions)
- Sharing? (add user_id column)

See docs for how.

---

## Commands Reference

### View your data (Supabase SQL)

```sql
-- See all decks
SELECT * FROM decks;

-- See all cards
SELECT * FROM cards;

-- See cards in specific deck
SELECT * FROM cards WHERE deck_id = 'deck-123';

-- Count total cards
SELECT COUNT(*) FROM cards;

-- Delete all data (careful!)
DELETE FROM cards;
DELETE FROM decks;
```

### Export data

```javascript
// In browser console
const data = StorageManager.exportData();
console.log(data); // Copy to file
```

### Clear cache

```javascript
// In browser console
StorageManager.clearAll(); // Clears browser cache
// (Data stays in Supabase!)
```

---

## Support

**Still confused?**

1. Check `API_KEY_FIX.md` for detailed debugging
2. Read `SUPABASE_SETUP_COMPLETE.md` troubleshooting
3. Check Supabase docs: https://supabase.com/docs
4. Open GitHub issue

---

## ✅ You're Done!

Your flashcard system now has:
- 💾 Browser storage (fast)
- ☁️ Cloud backup (Supabase)
- 🔄 Auto sync
- 📱 Cross-device
- 🚀 Ready to use!

**Happy studying!** 📚✨
