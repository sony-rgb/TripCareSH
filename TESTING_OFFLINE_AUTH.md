# Testing Offline-First Authentication

## Issue Fixed: RequiresOnline Screen Showing Incorrectly

### Problem
After signing in and turning off the API, the app was showing the "RequiresOnline" screen instead of allowing offline access.

### Root Cause
The bootstrap logic was running **before redux-persist finished rehydrating** the persisted auth token from AsyncStorage.

### Solution
1. Updated `useAuthBootstrap` hook to wait for `_persist.rehydrated` flag
2. Added `whitelist: ['auth', 'connectivity']` to persist config
3. Added comprehensive logging to bootstrap process

## Testing Scenarios

### Test 1: Fresh Install → Sign In → Offline Access ✅

**Steps:**
1. Uninstall app (or clear storage)
2. Install and launch app
3. Ensure internet is ON
4. App should show **SignIn** screen
5. Sign in with valid credentials
6. App navigates to **Main**
7. Close app completely
8. **Turn OFF API/Internet**
9. Relaunch app
10. Watch console logs

**Expected Result:**
```
[useAuthBootstrap] Waiting for redux-persist to rehydrate...
[useAuthBootstrap] Redux rehydrated, starting bootstrap
[useAuthBootstrap] Current auth state: { hasToken: true, expiresAt: ..., isLoggedIn: true }
[Bootstrap] Auth state: { hasToken: true, expiresAt: '2025-...', ... }
[Bootstrap] ✓ Valid token found, user is authenticated
[Bootstrap] Token expires: 2025-...
[Bootstrap] → Navigating to Main (valid token)
[Loading] Bootstrap complete, status: authenticatedOnline
[Loading] Navigating to Main
```

**App should:** Navigate to **Main app** (NOT RequiresOnline)

---

### Test 2: Expired Token Offline → Grace Period ✅

**Steps:**
1. Sign in with valid credentials
2. Close app
3. Manually expire token (see "Manual Token Expiry" section)
4. Turn OFF internet
5. Relaunch app

**Expected Console:**
```
[Bootstrap] ⚠ Token expired, checking API connectivity
[Bootstrap] Token expired at: 2025-...
[Bootstrap] API reachable: false
[Bootstrap] → Navigating to Main (expired token, offline - grace period)
```

**App should:** Navigate to **Main app** (offline grace period)

---

### Test 3: Expired Token Online → Prompt Sign In ✅

**Steps:**
1. Sign in with valid credentials
2. Close app
3. Manually expire token
4. Ensure internet is ON
5. Relaunch app

**Expected Console:**
```
[Bootstrap] ⚠ Token expired, checking API connectivity
[Bootstrap] API reachable: true
[Bootstrap] → Navigating to SignIn (expired token, API reachable)
```

**App should:** Navigate to **SignIn** screen

---

### Test 4: Fresh Install Offline → RequiresOnline ✅

**Steps:**
1. Uninstall app (or clear storage)
2. Turn OFF internet
3. Install and launch app

**Expected Console:**
```
[Bootstrap] No token found - user has never signed in
[Bootstrap] API reachable: false
[Bootstrap] → Navigating to RequiresOnline (no token, API unreachable)
```

**App should:** Show **RequiresOnline** screen

---

## Manual Token Expiry (for Testing)

### Option 1: Redux DevTools

If you have Redux DevTools:

```javascript
dispatch({
  type: 'SET_AUTH_TOKEN',
  payload: {
    token: 'existing-token-value',
    expiresAt: Date.now() - 1000  // Expired 1 second ago
  }
});
```

### Option 2: Direct Code Modification

Temporarily modify your sign-in code:

```typescript
// In SignInScreen or auth action
dispatch(setAuthToken(
  response.token,
  Date.now() + 5000  // Expires in 5 seconds (for testing)
));
```

Then wait 5 seconds before closing the app.

### Option 3: AsyncStorage Inspection

Use React Native Debugger or Flipper to view and edit AsyncStorage:

1. Find key: `persist:root`
2. Edit the `auth` object
3. Set `expiresAt` to a past timestamp

---

## Debugging Tips

### Enable Detailed Logging

The bootstrap process now logs extensively. Watch for these key messages:

```
✓ [useAuthBootstrap] Redux rehydrated, starting bootstrap
✓ [Bootstrap] Auth state: { hasToken: true, ... }
✓ [Bootstrap] ✓ Valid token found
✓ [Bootstrap] → Navigating to Main
```

### Check Redux State

After rehydration, check Redux state in debugger:

```javascript
// Should have these values after sign-in:
store.getState().auth = {
  login: { success: true },
  accessToken: "eyJhbGc...",
  expiresAt: 1748123456789,  // Unix timestamp in milliseconds
  bootstrapStatus: "authenticatedOnline"
}

store.getState()._persist = {
  version: -1,
  rehydrated: true  // ← This must be true before bootstrap
}
```

### Common Issues

#### Issue: Still showing RequiresOnline after sign-in
- **Check:** Is token being stored? Add log in sign-in handler:
  ```typescript
  console.log('Storing token:', token, 'expires:', expiresAt);
  dispatch(setAuthToken(token, expiresAt));
  ```
- **Check:** Is `expiresAt` in milliseconds? (not seconds)
- **Check:** Is 'auth' in whitelist? (store/index.ts)

#### Issue: Bootstrap runs before rehydration
- **Check:** `persistRehydrated` should be true before bootstrap
- **Check:** Console should show "Redux rehydrated" message
- **Solution:** Already fixed in useAuthBootstrap hook

#### Issue: Token expires immediately
- **Check:** `expiresAt` calculation:
  ```typescript
  ✅ Date.now() + (response.expiresIn * 1000)  // Correct
  ❌ Date.now() + response.expiresIn           // Wrong (if in seconds)
  ```

---

## What to Look For (Success Indicators)

### 1. Persistence Working ✓
```
# After sign-in, check AsyncStorage:
Key: persist:root
Value: { "auth": { "accessToken": "...", "expiresAt": 1748... } }
```

### 2. Rehydration Working ✓
```
[useAuthBootstrap] Waiting for redux-persist to rehydrate...
[useAuthBootstrap] Redux rehydrated, starting bootstrap  ← This line appears
```

### 3. Bootstrap Logic Working ✓
```
# Fresh install offline:
→ Navigating to RequiresOnline

# Fresh install online:
→ Navigating to SignIn

# Valid token (any connectivity):
→ Navigating to Main

# Expired token offline:
→ Navigating to Main (grace period)

# Expired token online:
→ Navigating to SignIn
```

---

## API Health Endpoint

Make sure your API has a health endpoint:

```
GET http://your-api.com/health

Response:
Status: 200 OK
Body: (optional)
```

Test manually:
```bash
curl -v http://your-api.com/health
```

Should return 2xx status within 5 seconds.

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Remove/disable excessive logging (if needed)
2. ✅ Update sign-in screen to use `setAuthToken`
3. ✅ Ensure API returns token + expiry
4. ✅ Test on physical device (not just emulator)
5. ✅ Test with slow/flaky network
6. ✅ Test with API down vs device offline

---

## Quick Test Commands

```bash
# Clear app data (Android)
adb shell pm clear co.tripcare

# Check AsyncStorage (Android)
adb shell run-as co.tripcare cat /data/data/co.tripcare/files/AsyncStorage/*

# Monitor logs
adb logcat | grep -E "Bootstrap|useAuthBootstrap|Loading"

# Toggle airplane mode (Android)
adb shell cmd connectivity airplane-mode enable
adb shell cmd connectivity airplane-mode disable
```

