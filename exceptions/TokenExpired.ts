export class TokenExpired extends Error {
    constructor(message: string = 'Token has expired') {
        super(message);
        this.name = 'TokenExpired';
    }
}