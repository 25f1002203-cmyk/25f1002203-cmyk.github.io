# 🚀 Quick Start - Supabase Setup (5 minutes)

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

### Open the app:
https://seenivasan.me/flashcards/

### Look for sync status (top-right):
- 🟢 "Synced" = Working!
- 🔴 "Error" = Check troubleshooting below

### Create a test deck:
1. Enter deck name
2. Click "+ Create Deck"
3. Wait 1 second

### Verify in Supabase:
1. Go to Supabase Dashboard
2. Click "Tables" → "decks"
3. Your deck should appear!

✅ **Success!** Data is syncing!

---

## Troubleshooting

### Sync shows 🔴 Error

**Check 1**: Open browser console (F12)
- What error message?
- Copy it and search

**Check 2**: Verify tables exist
- Supabase → Tables
- See `decks` and `cards`?

**Check 3**: Verify RLS enabled
- Supabase → Tables → decks
- Click "Authentication" tab
- See policies enabled?

**Check 4**: Clear browser cache
- Hard refresh: Ctrl+Shift+R (Windows)
- Or: Cmd+Shift+R (Mac)

### Table "not found" error

**Solution**: Run SQL schema creation above in SQL Editor

### Firewall blocking

**Check**: Do you have internet access to Supabase?
- Try: curl https://cnevpevsnslzowfbfzwe.supabase.co
- Should respond

### Still not working?

1. Open browser console (F12)
2. Copy ALL error messages
3. Check documentation: `SUPABASE_SETUP_COMPLETE.md`
4. See troubleshooting section

---

## What's Happening

### Behind the scenes:

```
You create deck
  ↓
💾 Saved to browser storage (INSTANT)
  ↓
🚀 Syncs to Supabase in background (1-5 sec)
  ↓
✅ Status shows "Synced"
```

### Why this is cool:

✅ **Instant feedback** - No waiting
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

1. Check browser console for errors (F12)
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
