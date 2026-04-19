# Quick Test Guide - Offline Auth Fix

## The Problem (Fixed)
- SignIn was using `AuthService` storage (separate AsyncStorage key)
- Bootstrap was checking `Redux` storage (different AsyncStorage key)
- They weren't connected! ❌

## The Solution
- SignIn now stores token in BOTH places ✅
- Bootstrap checks Redux first, AuthService as fallback ✅
- Token is now persisted correctly ✅

---

## Step-by-Step Test

### Prerequisites
1. Make sure your API is running
2. Have valid test credentials ready

---

### Test 1: Sign In & Offline Access ✅

**Step 1: Fresh Start**
```bash
# Clear app data (Android)
adb shell pm clear co.tripcare

# Or on the device:
Settings → Apps → TripCare → Storage → Clear Data
```

**Step 2: Sign In**
1. Launch app
2. Should show Loading → SignIn screen
3. Enter credentials and sign in
4. Should navigate to Main app

**Step 3: Watch Console Logs**
You should see:
```
[SignIn] Storing token in Redux: { token: "eyJhbG...", expiresAt: "2025-..." }
[SignIn] Signed in successfully as: Homer Simpson
```

**Step 4: Close App**
- Close app completely (swipe away from recent apps)

**Step 5: Turn Off API**
- Stop your API server
- Or turn off Wi-Fi/mobile data

**Step 6: Reopen App**
- Launch app again

**Expected Console Output:**
```
[useAuthBootstrap] Waiting for redux-persist to rehydrate...
[useAuthBootstrap] Redux rehydrated, starting bootstrap
[useAuthBootstrap] Current auth state: { hasToken: true, expiresAt: ..., isLoggedIn: true }
[Bootstrap] Redux auth state: { hasToken: true, expiresAt: "2025-...", ... }
[Bootstrap] ✓ Valid token found, user is authenticated
[Bootstrap] → Navigating to Main (valid token)
[Loading] Navigating to Main
```

**Expected Result:** ✅ App goes to **Main** screen (NOT RequiresOnline)

---

### Test 2: Verify Token is Saved

**Check AsyncStorage (Android):**
```bash
adb shell run-as co.tripcare cat /data/data/co.tripcare/files/RCTAsyncLocalStorage_V1/persist:root | grep -A 5 "auth"
```

**You should see:**
```json
{
  "auth": {
    "accessToken": "eyJhbG...",
    "expiresAt": 1748123456789,
    "login": { "success": true }
  }
}
```

---

### Common Issues & Fixes

#### Issue 1: Still Shows RequiresOnline
**Check console for:**
```
[Bootstrap] Redux auth state: { hasToken: false, ... }
```

**This means token wasn't saved. Check:**
1. Did you see "[SignIn] Storing token in Redux" log?
2. Is `whitelist: ['auth', 'connectivity']` in `store/index.ts`?

**Fix:** Clear data and sign in again

---

#### Issue 2: Console shows "No token in Redux, checking AuthService"
**This is OK!** It means:
- You signed in with the old version (before the fix)
- Bootstrap is migrating the token from AuthService to Redux
- Next time you open the app, it will use Redux

**You should also see:**
```
[Bootstrap] Found token in AuthService, migrating to Redux
[Bootstrap] Migrated token to Redux: { hasToken: true, ... }
```

---

#### Issue 3: Token expires immediately
**Check the "[SignIn] Storing token" log.**

If `expiresAt` is in the past or very close to now:
- Your API might be returning wrong expiry
- Or the timezone conversion is wrong

**Expected:** `expiresAt` should be at least 1 hour in the future

---

## Quick Console Check

Run this in React Native Debugger console:

```javascript
// Check if token is in Redux
const state = store.getState();
console.log('Auth state:', {
  hasToken: !!state.auth.accessToken,
  expiresAt: state.auth.expiresAt ? new Date(state.auth.expiresAt).toISOString() : null,
  isExpired: state.auth.expiresAt ? Date.now() >= state.auth.expiresAt : null,
});

// Check if redux-persist has rehydrated
console.log('Persist rehydrated:', state._persist?.rehydrated);
```

---

## Success Indicators ✅

### 1. Sign In Logs
```
✅ [SignIn] Storing token in Redux: { token: "...", expiresAt: "2025-..." }
✅ [SignIn] Signed in successfully
```

### 2. Bootstrap Logs (with API off)
```
✅ [useAuthBootstrap] Redux rehydrated, starting bootstrap
✅ [Bootstrap] Redux auth state: { hasToken: true, ... }
✅ [Bootstrap] ✓ Valid token found
✅ [Bootstrap] → Navigating to Main (valid token)
✅ [Loading] Navigating to Main
```

### 3. App Behavior
```
✅ Sign in → Main app
✅ Close app
✅ Turn off API
✅ Reopen app → Main app (NOT RequiresOnline)
```

---

## What Changed (Technical)

### Before (Bug):
```
┌─────────────┐     ┌──────────────┐
│   SignIn    │────>│ AuthService  │
└─────────────┘     │  (storage)   │
                    └──────────────┘
                           ❌
┌─────────────┐     ┌──────────────┐
│  Bootstrap  │────>│    Redux     │
└─────────────┘     │  (storage)   │
                    └──────────────┘
```
**Result:** SignIn saves to AuthService, Bootstrap checks Redux (empty) → RequiresOnline

### After (Fixed):
```
┌─────────────┐     ┌──────────────┐
│   SignIn    │────>│ AuthService  │
│             │     │  (storage)   │
│             │     └──────────────┘
│             │            │
│             │     ┌──────▼───────┐
│             │────>│    Redux     │
└─────────────┘     │  (storage)   │
                    └──────────────┘
                           ✅
┌─────────────┐            │
│  Bootstrap  │────────────┘
└─────────────┘
```
**Result:** SignIn saves to both, Bootstrap finds token in Redux → Main app

---

## Clean Test (Recommended)

For a completely clean test:

```bash
# 1. Clear app data
adb shell pm clear co.tripcare

# 2. Ensure API is running
curl http://your-api/health

# 3. Launch app and sign in

# 4. Close app completely

# 5. Stop API server

# 6. Launch app again → Should go to Main ✅
```

---

## Need Help?

If it still doesn't work:

1. **Share console logs** starting from app launch
2. **Check AsyncStorage** with the command above
3. **Verify** `store/index.ts` has `whitelist: ['auth', 'connectivity']`
4. **Confirm** you're testing with a **fresh sign-in** (not an old session)

