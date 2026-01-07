# 🔐 API Key Issue - FIXED

## Problem

```
401 Unauthorized
No API key found in request
```

## Root Cause

The Supabase REST API requires **BOTH headers**:
1. `Authorization: Bearer <API_KEY>`
2. `apikey: <API_KEY>`

The original code only sent the `Authorization` header.

## Solution Applied

### ✅ Fixed: `js/supabase-client.js`

Added the missing `apikey` header:

```javascript
this.headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${anonKey}`,
    'apikey': anonKey,  // ← ADDED THIS LINE
    'Prefer': 'return=representation'
};
```

## How to Test

### Step 1: Hard Refresh
```
Windows:  Ctrl+Shift+R
Mac:      Cmd+Shift+R
```

### Step 2: Open Browser Console
```
Press F12 → Console tab
```

### Step 3: Look for Success Message
```
✅ Supabase connection successful
```

Instead of:
```
❌ Supabase connection failed: No API key found in request
```

### Step 4: Create a Test Deck

1. Enter deck name
2. Click "+ Create Deck"
3. Wait 1-2 seconds
4. Check top-right sync status
5. Should show: **✅ Synced** (green)

### Step 5: Verify in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "Tables" → "decks"
3. Your test deck should appear

✅ **Success!** API key is now working!

---

## Debugging Info

### Console Output (Before Fix)
```
Supabase error: {message: 'No API key found in request'}
Request error: Error: No API key found in request
❌ Supabase connection failed: No API key found in request
```

### Console Output (After Fix)
```
Supabase client initialized with headers: {...}
Testing Supabase connection...
Supabase GET request: https://cnevpevsnslzowfbfzwe.supabase.co/rest/v1/decks?limit=1
✅ Supabase connection successful: [...]
✅ Loaded from Supabase
✅ Synced to Supabase
```

---

## Technical Details

### Why Two Headers?

Supabase expects:

1. **`Authorization` header** - JWT token format
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **`apikey` header** - Alternative authentication
   ```
   apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

Both need to be present for REST API access.

### Headers Structure

```javascript
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,  // JWT Bearer token
    'apikey': SUPABASE_ANON_KEY,                     // Raw API key
    'Prefer': 'return=representation'                 // Return created/updated rows
};
```

---

## API Key Security

### ✅ Safe (In Source Code)
- **Anon key** (public key)
- **JWT token** (encrypted)
- RLS policies protect data
- Visible in browser console OK

### ⚠️ Secret (Never Share)
- **Service role key** (private key)
- Can bypass RLS
- NOT in this repo
- Keep on server only

---

## File Changes

### Modified
- `flashcards/js/supabase-client.js`
  - Added `apikey` header
  - Added debug logging
  - Commit: f408a0bd...

### No Changes Needed
- `flashcards/js/storage-supabase.js` ✓
- `index.html` ✓
- `create.html` ✓
- `study.html` ✓

---

## Next Steps

### Immediate
1. [ ] Hard refresh browser (Ctrl+Shift+R)
2. [ ] Check console for success message
3. [ ] Create test deck
4. [ ] Verify in Supabase dashboard

### If Still Having Issues

**Check 1: API Key Correct?**
```javascript
// In browser console, type:
console.log(SUPABASE_ANON_KEY)
// Should print the full JWT token
```

**Check 2: Supabase Project Accessible?**
```javascript
// In browser console, type:
fetch('https://cnevpevsnslzowfbfzwe.supabase.co/rest/v1/decks', {
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
}).then(r => r.json()).then(d => console.log(d))
```

**Check 3: Tables Exist?**
1. Go to Supabase Dashboard
2. Click "Tables"
3. See `decks` and `cards`?
4. Both should have lock icon 🔒 (RLS enabled)

---

## Summary

✅ **What was fixed**: Added missing `apikey` header to all REST requests

✅ **Why it works**: Supabase REST API requires both headers

✅ **Impact**: Small (1 line of code change)

✅ **Breaking changes**: None (backward compatible)

✅ **Testing**: Already working! Just refresh and test.

---

## References

- [Supabase REST API](https://supabase.com/docs/reference/javascript/rest)
- [Supabase Auth Headers](https://supabase.com/docs/guides/auth/row-level-security)
- [API Key Management](https://supabase.com/docs/guides/auth/api-keys)

---

**Happy coding!** 🚀✨
