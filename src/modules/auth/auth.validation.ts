import { z } from 'zod'
export const signupSchema = {
    body: z.strictObject({
        userName: z.string({ error: "Name must be between 2 and 20 characters" }).min(2).max(20),
        email: z.email({ message: "Invalid email address" }),
        password: z.string({ error: "Password must be between 6 and 20 characters" }).min(6).max(20),
        phone: z.string().min(10).max(50),
    })
}

// .refine((data) => {  // refine is a method that allows us to add custom validation logic to the schema, it takes a function as an argument that receives the parsed data and returns a boolean value, if the function returns false, the validation will fail and the error message will be returned
//         return data.password == data.confirmPassword
//     }, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"]
//     })