import {regex} from '@utils';
import { API_BASE_URL } from '../appConfig';
import { IUserService } from './interfaces/IUserService';
import { IEmailVerificationService } from './interfaces/IEmailVerificationService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IAuthService } from './interfaces/IAuthService';
import i18next from 'i18next';
import { User } from '../models/User';
import UserModel from '../database/model/User';
import database from '../database/init';

export class UserService implements IUserService {
    private emailVerificationService: IEmailVerificationService;
    private userRepository: IUserRepository;
    private authService: IAuthService;

    constructor(
        emailVerificationService: IEmailVerificationService,
        userRepository: IUserRepository,
        authService: IAuthService
    ) {
        this.emailVerificationService = emailVerificationService;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async registerUser(
        name: string, 
        email: string, 
        password: string, 
        homeCityId: string): Promise<User> {
 
        if(!name || !email || !password || !homeCityId) {
            throw new Error("Please fill all fields");
        }

        if(!regex.name.test(name) || name.length < 2) {
            throw new Error("Invalid name");
        }

        if(!regex.email.test(email)) {
            throw new Error("Invalid email");
        }

        if(!regex.password.test(password)) {
            throw new Error(i18next.t('password_requirements'));
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
                method: 'POST',
                body: JSON.stringify({ name, email, password, homeCityId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 409) {
                throw new Error(i18next.t('sign_up_email_exists'));
            }

            if(response.status === 500) {
                throw new Error(i18next.t('sign_up_error'));
            }

            await this.emailVerificationService.sendVerificationEmail(name, email);

            const user: User = await response.json();
            return user;

        } catch (error) {
            console.error('Error during user registration:', error);
            throw error;
        }
    }

    async resetPassword(email: string): Promise<boolean> {
        if(!email || email.length === 0) {
            return false;
        }

        email = email.trim().toLowerCase();

        const response = await fetch(`${API_BASE_URL}/api/v1/user/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 404) {
            throw new Error('User not found');
        }

        return true;
    }

    /**
     * Fetch user profile from server and store in WatermelonDB
     */
    async fetchAndStoreUserProfile(): Promise<UserModel | null> {
        try {
            console.log('🔍 [fetchAndStoreUserProfile] Fetching user profile from server');
            
            // First, try to get user profile from the API
            const response = await this.authService.authenticatedFetch(
                `${API_BASE_URL}/api/v1/user/profile`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                console.log('⚠️ [fetchAndStoreUserProfile] Profile endpoint not OK, using auth user data');
                // If profile endpoint is not implemented, try to get user from sign-in response
                const currentUser = await this.authService.getCurrentUser();
                if (currentUser && currentUser.id && currentUser.email) {
                    // Use the current user data from AuthService (includes homeCityId and homeCityName from sign-in)
                    return await this.storeUserData({
                        id: currentUser.id,
                        email: currentUser.email,
                        name: currentUser.name,
                        homeCityId: currentUser.homeCityId || '',
                        homeCityName: currentUser.homeCityName,
                    });
                }
                console.warn('⚠️ [fetchAndStoreUserProfile] No valid user data from auth service');
                return null;
            }

            const profileData = await response.json();
            console.log('✅ [fetchAndStoreUserProfile] Got profile data:', {
                id: profileData.id || profileData.userId,
                email: profileData.email,
            });
            
            // Validate profile data before storing
            const userId = profileData.id || profileData.userId;
            if (!userId || !profileData.email) {
                console.warn('⚠️ [fetchAndStoreUserProfile] Profile data missing id or email, using fallback');
                const currentUser = await this.authService.getCurrentUser();
                if (currentUser && currentUser.id && currentUser.email) {
                    return await this.storeUserData({
                        id: currentUser.id,
                        email: currentUser.email,
                        name: currentUser.name,
                        homeCityId: currentUser.homeCityId || '',
                        homeCityName: currentUser.homeCityName,
                    });
                }
                return null;
            }
            
            // Store the user data in WatermelonDB
            return await this.storeUserData({
                id: userId,
                email: profileData.email,
                name: profileData.name,
                homeCityId: profileData.homeCityId || profileData.homeCity || '',
                homeCityName: profileData.homeCityName || await this.getCityName(profileData.homeCityId || profileData.homeCity),
            });
        } catch (error) {
            console.error('❌ [fetchAndStoreUserProfile] Error fetching user profile:', error);
            // Fallback: try to get user from AuthService
            try {
                const currentUser = await this.authService.getCurrentUser();
                if (currentUser && currentUser.id && currentUser.email) {
                    console.log('🔄 [fetchAndStoreUserProfile] Using fallback auth user data');
                    return await this.storeUserData({
                        id: currentUser.id,
                        email: currentUser.email,
                        name: currentUser.name,
                        homeCityId: currentUser.homeCityId || '',
                        homeCityName: currentUser.homeCityName,
                    });
                }
                console.warn('⚠️ [fetchAndStoreUserProfile] Fallback user has no valid ID/email');
            } catch (fallbackError) {
                console.error('❌ [fetchAndStoreUserProfile] Error in fallback user fetch:', fallbackError);
            }
            return null;
        }
    }

    /**
     * Store user data in WatermelonDB (create or update)
     * Supports multiple users on the same device
     */
    private async storeUserData(userData: {
        id: string;
        email: string;
        name: string;
        homeCityId: string;
        homeCityName?: string;
    }): Promise<UserModel> {
        console.log('📝 [storeUserData] Looking for existing user with ID:', userData.id);
        
        // Check if user already exists by ID (primary key)
        const existingUser = await this.userRepository.findById(userData.id);
        
        console.log('🔍 [storeUserData] findById result:', existingUser ? 'FOUND' : 'NOT FOUND');
        
        if (existingUser) {
            console.log('🔄 [storeUserData] Updating existing user:', existingUser.id);
            // Update existing user
            return await this.userRepository.update(existingUser, {
                email: userData.email,
                name: userData.name,
                homeCityId: userData.homeCityId,
                homeCityName: userData.homeCityName,
                updatedAtUtc: new Date(),
            });
        } else {
            console.log('➕ [storeUserData] Creating new user for multi-user support');
            
            const newUser = await this.userRepository.create({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                homeCityId: userData.homeCityId,
                homeCityName: userData.homeCityName,
                updatedAtUtc: new Date(),
            });
            
            console.log('✅ [storeUserData] New user created with ID:', newUser.id);
            return newUser;
        }
    }

    /**
     * Public helper to store the user we already received from auth response
     */
    async storeUserFromAuth(authUser: {
        id: string;
        email: string;
        name: string;
        homeCityId?: string;
        homeCityName?: string;
    }): Promise<UserModel> {
        console.log('💾 [storeUserFromAuth] Storing authenticated user:', {
            id: authUser.id,
            email: authUser.email,
            name: authUser.name,
        });
        
        const result = await this.storeUserData({
            id: authUser.id,
            email: authUser.email,
            name: authUser.name,
            homeCityId: authUser.homeCityId || '',
            homeCityName: authUser.homeCityName,
        });
        
        console.log('✅ [storeUserFromAuth] User stored successfully with ID:', result.id);
        return result;
    }

    /**
     * Get city name from placeId using location API
     */
    private async getCityName(placeId: string): Promise<string | undefined> {
        if (!placeId) {
            return undefined;
        }

        try {
            const response = await this.authService.authenticatedFetch(
                `${API_BASE_URL}/api/v1/location/${encodeURIComponent(placeId)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const cityData = await response.json();
                return cityData.name || cityData.cityName;
            }
        } catch (error) {
            console.error('Error fetching city name:', error);
        }

        return undefined;
    }

    /**
     * Get current user from WatermelonDB
     * Returns the user corresponding to the currently logged-in user from AuthService
     */
    async getCurrentUser(): Promise<UserModel | null> {
        try {
            // Get the logged-in user's ID from AuthService
            const authUser = await this.authService.getCurrentUser();
            if (!authUser || !authUser.id) {
                console.warn('⚠️ [UserService.getCurrentUser] No authenticated user found');
                return null;
            }
            
            console.log('🔍 [UserService.getCurrentUser] Looking for user with ID:', authUser.id);
            
            // Find the user by their ID in WatermelonDB
            const user = await this.userRepository.findById(authUser.id);
            
            if (user) {
                console.log('✅ [UserService.getCurrentUser] Found user in local DB:', {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                });
            } else {
                console.warn('⚠️ [UserService.getCurrentUser] User not found in local DB with ID:', authUser.id);
            }
            
            return user;
        } catch (error) {
            console.error('❌ [UserService.getCurrentUser] Error getting current user:', error);
            return null;
        }
    }
}
