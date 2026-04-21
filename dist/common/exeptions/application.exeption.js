export class ApplicationExeption extends Error {
    status;
    constructor(message, status, cause) {
        super(message, { cause });
        this.status = status;
        this.name = this.constructor.name;
    }
}
export class BadRequestExeption extends ApplicationExeption {
    constructor(message, status, cause) {
        super(message, 400, { cause });
    }
}
export class ConflictExeption extends ApplicationExeption {
    constructor(message, status, cause) {
        super(message, 409, { cause });
    }
}
export class NotFoundExeption extends ApplicationExeption {
    constructor(message, status, cause) {
        super(message, 404, { cause });
    }
}
export class UnauthorizedExeption extends ApplicationExeption {
    constructor(message, status, cause) {
        super(message, 401, { cause });
    }
}
export class ForbiddenExeption extends ApplicationExeption {
    constructor(message, status, cause) {
        super(message, 403, { cause });
    }
}
