import { z } from "zod";
import { signupSchema } from "./auth.validation.js";
// DTO stands for Data Transfer Object, it is a design pattern that is used to transfer data between different layers of an application, it is an object that contains only the data that is needed to perform a specific operation, it is used to decouple the different layers of the application and to avoid exposing the internal structure of the application to the outside world.
// In this file we are defining the DTOs for the login and signup operations, we are using the zod library to define the validation rules for the data that is being transferred, we are also using the z.infer utility type to infer the TypeScript type from the zod schema, this way we can ensure that the data that is being transferred is valid and has the correct structure.
export interface LoginDTO{
    userName: string;
    email: string;
    password: string;
    phone: string;
}
export type SignupDTO = z.infer<typeof signupSchema.body> // z.infer is a utility type provided by zod that allows us to infer the TypeScript type from a zod schema, in this case we are inferring the type from the body property of the signupSchema object, which is a strictObject that contains the properties name, email, password and confirmPassword with their respective validation rules.