# Integration Example: Sign-In Screen

This document shows how to integrate the offline-first auth system with your existing SignIn screen.

## Before: Existing SignIn Logic

Your current `SignIn` screen likely looks something like this:

```typescript
import { authentication } from '@actions';

const handleSignIn = () => {
  dispatch(authentication(true, (response) => {
    if (response.success) {
      navigation.replace('Main');
    }
  }));
};
```

## After: Enhanced with Token Management

Here's how to enhance it to work with the offline-first system:

```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '@actions/auth';
import { useIsApiReachable } from '@hooks';

export default function SignIn({ navigation }) {
  const dispatch = useDispatch();
  const isApiReachable = useIsApiReachable();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (email, password) => {
    // Prevent sign-in if API is not reachable
    if (isApiReachable === false) {
      setError('Cannot sign in while offline. Please check your connection.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call your existing API
      const response = await YourApiService.signIn(email, password);

      // Calculate expiry time
      // If your API returns expiresIn (in seconds), convert to timestamp
      const expiresAt = Date.now() + (response.expiresIn * 1000);

      // OR if your API returns an expiry date string:
      // const expiresAt = new Date(response.expiresAt).getTime();

      // Store the token and expiry in Redux
      dispatch(setAuthToken(response.token, expiresAt));

      // Also update the old login state for compatibility
      dispatch(authentication(true));

      // Navigate to main app
      navigation.replace('Main');
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Show offline warning */}
      {isApiReachable === false && (
        <Banner type="warning">
          You're currently offline. Sign in requires an internet connection.
        </Banner>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput 
        placeholder="Email"
        // ... props
      />
      
      <TextInput 
        placeholder="Password"
        secureTextEntry
        // ... props
      />

      <Button
        onPress={() => handleSignIn(email, password)}
        loading={loading}
        disabled={isApiReachable === false}
      >
        Sign In
      </Button>
    </View>
  );
}
```

## API Service Example

Here's a complete example of an API service that returns the required data:

```typescript
// services/ApiService.ts
import { API_BASE_URL } from '../appConfig';

class ApiService {
  async signIn(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sign in failed');
    }

    const data = await response.json();

    // Expected API response:
    // {
    //   token: "eyJhbGciOiJIUzI1NiIs...",
    //   expiresIn: 3600  // seconds until expiry
    // }

    return {
      token: data.token,
      expiresIn: data.expiresIn,  // in seconds
      user: data.user,
    };
  }

  // Helper to get token for authenticated requests
  async getAuthToken(getState: any): Promise<string | null> {
    const state = getState();
    const { accessToken, expiresAt } = state.auth;

    if (!accessToken || !expiresAt) {
      return null;
    }

    // Check if token is expired
    if (Date.now() >= expiresAt) {
      return null;
    }

    return accessToken;
  }

  // Example authenticated request
  async getTrips(dispatch: any, getState: any) {
    const token = await this.getAuthToken(getState);

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/trips`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token is invalid, prompt for sign in
      throw new Error('Session expired. Please sign in again.');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }

    return response.json();
  }
}

export default new ApiService();
```

## Minimal Changes Approach

If you want to make **minimal changes** to your existing code, you can modify your existing `authentication` thunk in `actions/auth.ts`:

```typescript
// In actions/auth.ts
export const authentication = (
  login: boolean,
  callback?: (data: {success: boolean}) => void
) => async (dispatch: any) => {
  // Your existing logic...
  
  // After successful API call, if you have the token and expiry:
  if (apiResponse?.token && apiResponse?.expiresIn) {
    const expiresAt = Date.now() + (apiResponse.expiresIn * 1000);
    dispatch(setAuthToken(apiResponse.token, expiresAt));
  }
  
  // Continue with your existing logic
  dispatch(onLogin({ success: login }));
  
  if (typeof callback === 'function') {
    callback({success: true});
  }
};
```

## Handling Token Expiry in API Calls

When making API calls, handle 401 (Unauthorized) responses:

```typescript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = selectAuthToken(store.getState());

  if (!token) {
    // Redirect to sign in
    navigation.replace('SignIn');
    throw new Error('Not authenticated');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    dispatch(logout());
    navigation.replace('SignIn');
    throw new Error('Session expired');
  }

  return response;
};
```

## Logout Implementation

Update your logout to clear the token:

```typescript
export const logout = (callback?: () => void) => (dispatch: any) => {
  // Clear auth state (this already clears token in the enhanced reducer)
  dispatch(onLogout());
  
  // Optional: Clear connectivity state
  dispatch(resetConnectivity());
  
  if (typeof callback === 'function') {
    callback();
  }
};
```

## Testing Your Integration

### Test 1: Sign In Online

1. Open app (ensure internet is on)
2. App should show SignIn screen
3. Enter credentials and sign in
4. Should navigate to Main
5. Close app completely
6. Reopen app
7. Should navigate directly to Main (token persisted)

### Test 2: Sign In Offline

1. Turn off internet
2. Open app
3. Should show "RequiresOnline" screen
4. Turn on internet
5. Should automatically navigate to SignIn
6. Enter credentials and sign in
7. Should navigate to Main

### Test 3: Expired Token Offline

1. Sign in and use app (token valid)
2. Manually set token expiry to past:
   ```typescript
   // In Redux DevTools or via action:
   dispatch(setAuthToken(currentToken, Date.now() - 1000));
   ```
3. Close and reopen app with internet OFF
4. Should still navigate to Main (offline grace period)

### Test 4: Expired Token Online

1. Same as Test 3, but with internet ON
2. Should navigate to SignIn (prompt for new token)

## Common Pitfalls

### ❌ Don't: Store expiry in seconds

```typescript
// WRONG:
dispatch(setAuthToken(token, 3600));  // This is 3600ms = 3.6 seconds!
```

### ✅ Do: Store expiry as Unix timestamp in milliseconds

```typescript
// CORRECT:
dispatch(setAuthToken(token, Date.now() + 3600000));  // 1 hour from now
```

### ❌ Don't: Assume API is always reachable

```typescript
// WRONG:
const handleSignIn = () => {
  // Just call API without checking connectivity
  api.signIn(email, password);
};
```

### ✅ Do: Check connectivity before API calls

```typescript
// CORRECT:
const handleSignIn = () => {
  if (isApiReachable === false) {
    showError('Cannot sign in while offline');
    return;
  }
  api.signIn(email, password);
};
```

## Next Steps

1. Update your `SignIn` screen with token management
2. Update your API service to return token + expiry
3. Update authenticated API calls to use token from Redux
4. Test all scenarios above
5. Add offline banners to screens that require connectivity

For full documentation, see `OFFLINE_AUTH_README.md`.

