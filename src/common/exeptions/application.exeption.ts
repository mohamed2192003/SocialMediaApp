interface AError{
    status: number;
    message: string;
    cause?: unknown;
}
export class ApplicationExeption extends Error implements AError{
    constructor(message: string,  public status: number, cause?: unknown){
        super(message, { cause })
        this.name = this.constructor.name
    }
}
export class BadRequestExeption extends ApplicationExeption{
    constructor(message: string, status?: number, cause?: unknown){
        super(message, 400, {cause})
    }
}
export class ConflictExeption extends ApplicationExeption{
    constructor(message: string, status?: number, cause?: unknown){
        super(message, 409, {cause})
    }
}
export class NotFoundExeption extends ApplicationExeption{
    constructor(message: string, status?: number, cause?: unknown){
        super(message, 404, {cause})
    }
}
export class UnauthorizedExeption extends ApplicationExeption{
    constructor(message: string, status?: number, cause?: unknown){
        super(message, 401, {cause})
    }
}
export class ForbiddenExeption extends ApplicationExeption{
    constructor(message: string, status?: number, cause?: unknown){
        super(message, 403, {cause})
    }
}