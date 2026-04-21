import { Request, Response } from "express";
export const globalErrorHandler = (err: any, req: Request, res: Response, next: any)=>{ // global error handler middleware function that takes the error, request, response and next function as arguments, it is used to handle any errors that occur in the application and return a proper response to the client
    return res.status(err.status || 500).json({ 
        message: err.message, 
        stack: err.stack,
        cause: err.cause
     })
}