import { API_BASE_URL } from "../appConfig";
import { IEmailVerificationService } from "./interfaces/IEmailVerificationService";

export class EmailVerificationService implements IEmailVerificationService {
    async verifyEmail(token: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/email-verification/verify?token=${token}`);
            
            if(!response.ok) {
                const data = await response.json();
                throw new Error(`Failed to verify email. ${data.message}`); 
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            throw error;
        }
    }
    
    async sendVerificationEmail(name: string, email: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/email-verification/send-email`, {
                method: 'POST',
                body: JSON.stringify({ name, email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send verification email');
            }

        } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
        }
    }

    async resendVerificationEmail(token: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/email-verification/resend-email`, {
                method: 'POST',
                body: JSON.stringify({ token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) 
                {
                throw new Error('Failed to send verification email');
            }

        } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
        }
    }
}
