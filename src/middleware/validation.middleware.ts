import type { NextFunction, Request, Response } from "express"
import { BadRequestExeption } from "../common/exeptions/application.exeption.js"
import { ZodError, ZodType } from "zod"
type ValidationKey = keyof Request  // ValidationKey is a type that represents the keys of the Request object, it can be body, query, params, headers
type ValidationSchema = Partial<Record<ValidationKey, ZodType>> // Partial makes all properties optional, Record creates an object type with keys of type ValidationKey and values of type ZodType
export const validation = (schema: ValidationSchema) => { // validation middleware function that takes a schema object as an argument, the schema object has optional properties of body, query, params, headers, each property is a zod schema that validates the corresponding part of the request
    return ((req: Request, res: Response, next: NextFunction) => { // return a middleware function that takes the request, response and next function as arguments
        let validationError: { key: ValidationKey; issue: ZodError["issues"] }[] = [] // array to store validation errors, it has key and issue properties, key is the part of the request that has the error (body, query, params, headers) and issue is the array of validation errors returned by zod
        for (const key of Object.keys(schema) as ValidationKey[]) {  // loop on body, query, params, headers
            if (!schema[key]) { // if the key is not defined in the schema, skip it
                continue
            }
            const value = schema[key].safeParse(req[key]) // validate the request data using zod's safeParse method, it returns an object with success and error properties
            if (!value.success) {
                validationError.push({ key, issue: value.error.issues }) // if there is a validation error, push it to the validationError array
            }
        }
        if (validationError.length > 0) {
            throw new BadRequestExeption("Validation failed", 400, validationError) // if there are validation errors, return 400 with the errors
        }
        next() // if the validation is successful, call the next middleware or controller 
    })
} 