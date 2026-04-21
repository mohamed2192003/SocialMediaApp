import { BadRequestExeption } from "../common/exeptions/application.exeption.js";
export const validation = (schema) => {
    return ((req, res, next) => {
        let validationError = []; // array to store validation errors, it has key and issue properties, key is the part of the request that has the error (body, query, params, headers) and issue is the array of validation errors returned by zod
        for (const key of Object.keys(schema)) { // loop on body, query, params, headers
            if (!schema[key]) { // if the key is not defined in the schema, skip it
                continue;
            }
            const value = schema[key].safeParse(req[key]); // validate the request data using zod's safeParse method, it returns an object with success and error properties
            if (!value.success) {
                validationError.push({ key, issue: value.error.issues }); // if there is a validation error, push it to the validationError array
            }
        }
        if (validationError.length > 0) {
            throw new BadRequestExeption("Validation failed", 400, validationError); // if there are validation errors, return 400 with the errors
        }
        next(); // if the validation is successful, call the next middleware or controller 
    });
};
