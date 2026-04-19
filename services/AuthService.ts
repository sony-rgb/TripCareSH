import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../appConfig';
import { IAuthService, User } from './interfaces/IAuthService';
import { TokenExpired } from '../exceptions/TokenExpired';
import { Unauthorized } from '../exceptions/Unauthorized';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    tokenType: string;
}

interface AuthResponse {
    accessToken: {
        token: string;
        expiresAt: string;
    };
    refreshToken: {
        token: string;
        expiresAt: string;
    };
    tokenType: string;
    user: User;
}

class AuthService implements IAuthService {
    private static instance: AuthService;
    private tokens: AuthTokens | null = null;
    private user: User | null = null;
    private refreshPromise: Promise<AuthTokens> | null = null;

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Sign in user and store tokens
     */
    async signIn(email: string, password: string): Promise<User> {
        try {
            console.log(`hit: ${API_BASE_URL}`);
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('API Error Response:', errorData);
                
                // Handle the nested error format from the API
                const errorMessage = errorData.error?.message || errorData.message || 'Sign in failed';
                const error = new Error(errorMessage);
                (error as any).status = response.status;
                (error as any).response = errorData;
                throw error;
            }

            const data: AuthResponse = await response.json();
            
            // Store tokens and user info
            this.tokens = {
                accessToken: data.accessToken.token,
                refreshToken: data.refreshToken.token,
                expiresAt: data.accessToken.expiresAt,
                tokenType: data.tokenType,
            };
            
            this.user = data.user;

            // Persist to storage
            await this.persistTokens();
            await this.persistUser();

            return this.user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    /**
     * Sign out user and clear tokens
     */
    async signOut(): Promise<void> {
        try {
            if (this.tokens?.accessToken) {
                // Call signout endpoint to invalidate refresh token
                await fetch(`${API_BASE_URL}/api/v1/auth/signout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.tokens.accessToken}`,
                    },
                });
            }
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            // Clear local data regardless of server response
            this.tokens = null;
            this.user = null;
            await this.clearStorage();
        }
    }

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<User> {
        return this.user;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.tokens !== null && !this.isTokenExpired();
    }

    /**
     * Get access token for API calls
     */
    async getAccessToken(): Promise<string | null> {
        if (!this.tokens) {
            return null;
        }

        // Check if token is expired
        if (this.isTokenExpired()) {
            try {
                await this.refreshTokens();
            } catch (error) {
                console.error('Token refresh failed:', error);
                await this.signOut();
                return null;
            }
        }

        return this.tokens.accessToken;
    }

    /**
     * Check if current access token is expired
     */
    private isTokenExpired(): boolean {
        if (!this.tokens?.expiresAt) {
            return true;
        }

        const expiryTime = new Date(this.tokens.expiresAt).getTime();
        const currentTime = Date.now();
        
        // Add 30 second buffer to prevent edge cases
        return currentTime >= (expiryTime - 30000);
    }

    /**
     * Refresh access token using refresh token
     */
    private async refreshTokens(): Promise<AuthTokens> {
        // Prevent multiple simultaneous refresh requests
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this.performTokenRefresh();

        try {
            const tokens = await this.refreshPromise;
            return tokens;
        } finally {
            this.refreshPromise = null;
        }
    }

    /**
     * Perform the actual token refresh
     */
    private async performTokenRefresh(): Promise<AuthTokens> {
        if (!this.tokens?.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: this.tokens.refreshToken,
                }),
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data: AuthResponse = await response.json();
            
            // Update tokens
            this.tokens = {
                accessToken: data.accessToken.token,
                refreshToken: data.refreshToken.token,
                expiresAt: data.accessToken.expiresAt,
                tokenType: data.tokenType,
            };

            // Persist updated tokens
            await this.persistTokens();

            return this.tokens;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    }

    /**
     * Load tokens and user from storage on app start
     */
    async loadFromStorage(): Promise<void> {
        try {
            const [tokensJson, userJson] = await Promise.all([
                AsyncStorage.getItem('auth_tokens'),
                AsyncStorage.getItem('auth_user'),
            ]);

            if (tokensJson) {
                this.tokens = JSON.parse(tokensJson);
            }

            if (userJson) {
                this.user = JSON.parse(userJson);
            }

            // Check if loaded tokens are still valid
            if (this.tokens && this.isTokenExpired()) {
                console.log('Stored tokens are expired, attempting refresh...');
                try {
                    await this.refreshTokens();
                } catch (error) {
                    console.log('Failed to refresh stored tokens, clearing auth state');
                    await this.clearStorage();
                }
            }
        } catch (error) {
            console.error('Error loading auth data from storage:', error);
            await this.clearStorage();
        }
    }

    /**
     * Persist tokens to storage
     */
    private async persistTokens(): Promise<void> {
        if (this.tokens) {
            await AsyncStorage.setItem('auth_tokens', JSON.stringify(this.tokens));
        }
    }

    /**
     * Persist user to storage
     */
    private async persistUser(): Promise<void> {
        if (this.user) {
            await AsyncStorage.setItem('auth_user', JSON.stringify(this.user));
        }
    }

    /**
     * Clear all stored auth data
     */
    private async clearStorage(): Promise<void> {
        await Promise.all([
            AsyncStorage.removeItem('auth_tokens'),
            AsyncStorage.removeItem('auth_user'),
        ]);
    }

    /**
     * Create authenticated fetch wrapper
     */
    async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
        const token = await this.getAccessToken();
        
        if (!token) {
            throw new Unauthorized();
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            },
        });

        // Handle 401 responses by attempting token refresh
        if (response.status === 401) {
            try {
                await this.refreshTokens();
                const newToken = await this.getAccessToken();
                
                if (newToken) {
                    // Retry the request with new token
                    return fetch(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            'Authorization': `Bearer ${newToken}`,
                        },
                    });
                }
            } catch (error) {
                console.error('Token refresh failed during request:', error);
                await this.signOut();
                throw new TokenExpired();
            }
        }

        return response;
    }
}

export default AuthService.getInstance();
