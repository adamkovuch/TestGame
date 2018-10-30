export class AppError extends Error {
    responsecode: number;
    data: any;

    constructor(code: number, message: string, data?: any) {
        super(message);
        this.responsecode = code;
        this.data = data;
    }
}