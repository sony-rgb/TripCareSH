# Offline-First Authentication & Connectivity System

## Overview

This implementation provides a robust offline-first authentication system with global API connectivity monitoring. The app works seamlessly offline while respecting authentication requirements.

## Key Features

- ✅ **Offline-first**: App works without internet after initial sign-in
- ✅ **Smart Auth**: Don't prompt for sign-in if token exists and API is unreachable
- ✅ **Token Expiry**: Automatic handling of expired tokens based on connectivity
- ✅ **Global Connectivity**: All screens can check API reachability
- ✅ **Redux Persistence**: Auth state persisted via redux-persist
- ✅ **Health Checks**: Automatic periodic API health monitoring

## Architecture

### Redux State Structure

```typescript
{
  auth: {
    login: { success: boolean },
    accessToken: string | null,
    expiresAt: number | null,  // Unix timestamp in ms
    bootstrapStatus: AuthBootstrapStatus
  },
  connectivity: {
    apiReachable: boolean | null,  // null = unknown
    checking: boolean,
    lastCheckedAt: number | null,
    error: string | null
  }
}
```

### Bootstrap Status Flow

```
'checking'              → App is determining auth state
'needsSignIn'           → User must sign in (API reachable, no token)
'needsOnlineToSignIn'   → User must be online to sign in (API unreachable, no token)
'authenticatedOnline'   → User authenticated, API reachable
'authenticatedOffline'  → User authenticated, API unreachable
```

## Decision Logic

### On App Startup (Bootstrap)

1. **No Token**
   - API Reachable → Navigate to **SignIn**
   - API Unreachable → Navigate to **RequiresOnline** screen

2. **Token Exists & NOT Expired**
   - Immediately navigate to **Main App**
   - Check connectivity in background (non-blocking)

3. **Token Exists & Expired**
   - API Unreachable → Navigate to **Main App** (allow offline access)
   - API Reachable → Navigate to **SignIn** (prompt for new token)

## File Structure

```
src/app/
├── config/
│   └── api.ts                    # API health check logic
├── reducers/
│   ├── auth.ts                   # Enhanced auth reducer
│   ├── connectivity.ts           # Connectivity state reducer
│   └── index.ts                  # Combined reducers
├── actions/
│   ├── auth.ts                   # Auth actions + bootstrap thunk
│   ├── connectivity.ts           # Connectivity actions + health check thunk
│   └── actionTypes.ts            # Action type constants
├── hooks/
│   ├── useAuth.ts                # Auth-related hooks
│   ├── useConnectivity.ts        # Connectivity hooks
│   └── index.ts                  # Exports
├── screens/
│   ├── Loading/                  # Bootstrap/splash screen
│   └── RequiresOnline/           # "Must be online" screen
└── navigation/
    └── index.tsx                 # Navigation with conditional rendering
```

## Usage Examples

### 1. Check API Connectivity in Any Screen

```typescript
import { useIsApiReachable } from '@hooks';

function MyScreen() {
  const isApiReachable = useIsApiReachable();

  if (isApiReachable === false) {
    return (
      <Banner>
        You're offline. Some features may not work.
      </Banner>
    );
  }

  return <MyContent />;
}
```

### 2. Disable Actions When Offline

```typescript
import { useConnectivity } from '@hooks';

function CreateTripScreen() {
  const { isReachable, checking } = useConnectivity();

  return (
    <Button
      disabled={!isReachable}
      loading={checking}
      onPress={createTrip}
    >
      {isReachable ? 'Create Trip' : 'Offline - Cannot Create'}
    </Button>
  );
}
```

### 3. Manual Connectivity Check

```typescript
import { useConnectivity } from '@hooks';

function SettingsScreen() {
  const { isReachable, checkNow } = useConnectivity();

  return (
    <View>
      <Text>Status: {isReachable ? 'Online' : 'Offline'}</Text>
      <Button onPress={checkNow}>Check Connection</Button>
    </View>
  );
}
```

### 4. Sign-In Integration

After successful sign-in, store the token and expiry:

```typescript
import { useDispatch } from 'react-redux';
import { setAuthToken } from '@actions/auth';

function SignInScreen() {
  const dispatch = useDispatch();

  const handleSignIn = async (email, password) => {
    const response = await api.signIn(email, password);
    
    // Store token with expiry
    dispatch(setAuthToken(
      response.token,
      response.expiresAt  // Unix timestamp in milliseconds
    ));
    
    // Navigate to main app
    navigation.replace('Main');
  };

  return <SignInForm onSubmit={handleSignIn} />;
}
```

## Configuration

### API Base URL & Health Endpoint

Edit `config/api.ts`:

```typescript
import { API_BASE_URL } from '../appConfig';

export const API_HEALTH_ENDPOINT = `${API_BASE_URL}/health`;
export const API_HEALTH_TIMEOUT = 5000;  // 5 seconds
export const CONNECTIVITY_CHECK_INTERVAL = 60000;  // 60 seconds
```

### Environment Variables

Set in your `.env` file:

```bash
EXPO_PUBLIC_API_URL_DEV_ANDROID=http://10.0.2.2:3000
EXPO_PUBLIC_API_URL_DEV_IOS=http://localhost:3000
EXPO_PUBLIC_API_URL_PROD=https://api.tripcare.co
```

## Testing Scenarios

### Test Case 1: Fresh Install, Online
1. App starts → Loading screen
2. Bootstrap runs → No token found
3. Health check → API reachable
4. Navigate to → SignIn screen

### Test Case 2: Fresh Install, Offline
1. App starts → Loading screen
2. Bootstrap runs → No token found
3. Health check → API unreachable
4. Navigate to → RequiresOnline screen

### Test Case 3: Valid Token, Online
1. App starts → Loading screen
2. Bootstrap runs → Token found, not expired
3. Navigate to → Main app (immediately)
4. Background check → API reachable

### Test Case 4: Valid Token, Offline
1. App starts → Loading screen
2. Bootstrap runs → Token found, not expired
3. Navigate to → Main app (immediately)
4. Background check → API unreachable
5. Status → authenticatedOffline

### Test Case 5: Expired Token, Online
1. App starts → Loading screen
2. Bootstrap runs → Token found, expired
3. Health check → API reachable
4. Navigate to → SignIn screen

### Test Case 6: Expired Token, Offline
1. App starts → Loading screen
2. Bootstrap runs → Token found, expired
3. Health check → API unreachable
4. Navigate to → Main app (allow offline access)
5. Status → authenticatedOffline

## API Integration Points

### Health Endpoint Requirements

Your API must provide a health check endpoint:

```
GET /health

Response:
- Status: 200 OK (or any 2xx)
- Body: (optional, not parsed)
```

The system considers API reachable if:
- Response status is 2xx
- Response received within 5 seconds

The system considers API unreachable if:
- Timeout (> 5 seconds)
- Network error
- DNS failure
- Any non-2xx response

### Sign-In API Integration

Your sign-in API should return:

```typescript
interface SignInResponse {
  token: string;
  expiresAt: number;  // Unix timestamp in milliseconds
  // ... other fields
}
```

Example:

```typescript
// In your AuthService or API client
const signIn = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  
  return {
    token: data.token,
    expiresAt: Date.now() + (data.expiresIn * 1000),  // Convert seconds to ms
  };
};
```

## Periodic Monitoring

The global connectivity monitor runs:
- On app mount
- Every 60 seconds (configurable)
- On user-initiated checks (via `checkNow()`)

To adjust the interval, edit `CONNECTIVITY_CHECK_INTERVAL` in `config/api.ts`.

## Redux Selectors

```typescript
// Auth selectors
selectAuthState(state)          // Full auth state
selectBootstrapStatus(state)    // Current bootstrap status
selectIsAuthenticated(state)    // Is user logged in?
selectAuthToken(state)          // Current token
selectIsTokenExpired(state)     // Is token expired?

// Connectivity selectors
selectIsApiReachable(state)     // Is API reachable?
selectConnectivityState(state)  // Full connectivity state
```

## Troubleshooting

### Issue: App always shows "Needs Online"

**Solution**: Check that `API_HEALTH_ENDPOINT` is correct and the endpoint returns 2xx status.

```typescript
// Test manually:
const result = await checkApiHealth();
console.log('API reachable:', result);
```

### Issue: Token expiry not working

**Solution**: Ensure `expiresAt` is in **milliseconds** (not seconds):

```typescript
// ✅ Correct:
dispatch(setAuthToken(token, Date.now() + 3600000));  // 1 hour

// ❌ Wrong:
dispatch(setAuthToken(token, Date.now() + 3600));     // Only 3.6 seconds!
```

### Issue: Always prompted to sign in

**Solution**: Check that token is being persisted. Verify redux-persist is configured:

```typescript
// In store/index.ts
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'connectivity'],  // ← Ensure 'auth' is whitelisted
};
```

## Future Enhancements

Potential improvements:

1. **Network Info Integration**: Use `@react-native-community/netinfo` to avoid health checks when device has no network
2. **Token Refresh**: Automatic token refresh before expiry (when online)
3. **Offline Queue**: Queue API requests made while offline
4. **Sync Manager**: Background sync for offline changes
5. **Retry Logic**: Exponential backoff for health checks
6. **Notification**: Alert user when connectivity is restored

## Credits

Implemented following offline-first patterns for React Native with Redux.

