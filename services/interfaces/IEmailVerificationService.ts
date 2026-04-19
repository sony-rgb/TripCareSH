export interface IEmailVerificationService {
    sendVerificationEmail(name: string, email: string): Promise<void>;
    resendVerificationEmail(token: string): Promise<void>;
    verifyEmail(token: string): Promise<void>;
}