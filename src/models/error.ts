export class Error {
    code: number;
    message: string;
    
    private static code2Message: { [id: number]: string; } = {
        403: 'forbidden'
    }
    
    constructor(code: number, message?: string) {
        this.code = code;
        this.message = message? message: Error.code2Message[code];
    }
}