export class Exception {
    code: number;
    message: string;
    
    private static code2Message: { [id: number]: string; } = {
        403: 'forbidden'
    }
    
    constructor(code: number, message?: string) {
        this.code = code;
        this.message = message? message: Exception.code2Message[code];
    }
}

export class ExceptionFactory {
    $new (code: number, message?: string) {
        return new Exception(code, message);
    }
}