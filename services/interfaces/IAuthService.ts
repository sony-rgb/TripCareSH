export interface User {
    id: string;
    email: string;
    name: string;
    homeCityId?: string;
    homeCityName?: string;
}

export interface IAuthService {
    signIn(email: string, password: string): Promise<User>;
    signOut(): Promise<void>;
    getCurrentUser(): Promise<User>;
    getAccessToken(): Promise<string | null>;
    authenticatedFetch(url: string, options: RequestInit): Promise<Response>;
}