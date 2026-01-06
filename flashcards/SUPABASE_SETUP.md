# Supabase Setup for Flashcards

## Database Configuration

### Step 1: Create Tables in Supabase

Go to your Supabase dashboard and run these SQL queries in the SQL Editor:

```sql
-- Create decks table
CREATE TABLE decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cards table
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unknown', -- 'unknown', 'review', 'known'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_cards_deck_id ON cards(deck_id);
CREATE INDEX idx_decks_created_at ON decks(created_at);
```

### Step 2: Enable Row Level Security (RLS)

```sql
-- Enable RLS on both tables
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (no auth)
CREATE POLICY "Allow public read on decks" ON decks
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on decks" ON decks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on decks" ON decks
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on decks" ON decks
    FOR DELETE USING (true);

CREATE POLICY "Allow public read on cards" ON cards
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on cards" ON cards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on cards" ON cards
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on cards" ON cards
    FOR DELETE USING (true);
```

### Step 3: Verify Setup

1. Go to Supabase Dashboard → Tables
2. You should see:
   - `decks` table
   - `cards` table
3. Both tables should have RLS enabled (lock icon visible)

## Configuration

Your credentials are already configured in `js/supabase-client.js`:

```javascript
const SUPABASE_URL = 'https://cnevpevsnslzowfbfzwe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZXZwZXZzbnNsem93ZmJmendlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MjQxOTksImV4cCI6MjA4MzMwMDE5OX0.hjz9xl4E4spNTquK6UEOHVIv31SnlXI0xp7U-EKczmU';
```

## Data Sync Strategy

- **Immediate sync**: On every create/update/delete
- **Fallback**: localStorage for offline support
- **Conflict resolution**: Server data takes precedence
- **Sync status**: Visual indicator in UI

## Features

✅ Automatic sync to Supabase on changes
✅ Offline support (localStorage fallback)
✅ Real-time updates across devices
✅ Public data (no authentication needed)
✅ Automatic error recovery
✅ Sync status indicator

## Testing

1. Create a deck in one browser
2. Open in another browser/incognito
3. Data should sync automatically ✨
4. Data persists in Supabase dashboard

## Troubleshooting

**"Not authenticated"** - Check Supabase Anon key is correct
**"Table not found"** - Run the SQL schema setup
**"RLS policy denied"** - Verify policies were created
**"Sync not working"** - Check browser console for errors

## Support

For Supabase issues: https://supabase.com/docs
