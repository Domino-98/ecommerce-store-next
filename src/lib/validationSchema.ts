import { z } from 'zod'

const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
)

export const userSignupSchema = z.object({
    email: z.string().email().min(1, "Email cannot be blank"),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .regex(passwordValidation, {
            message: 'Must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
        }),
    confirmPassword: z.string().min(1, { message: 'Password confirmation is required' }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords does not match'
})

export const userSigninSchema = z.object({
    email: z.string().email().min(1, "Email cannot be blank"),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
})

export const userEmailSchema = z.object({
    email: z.string().email().min(1, "Email cannot be blank")
})

export const userResetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(1, { message: 'Password is required' })
        .regex(passwordValidation, {
            message: 'Must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
        }),
    confirmPassword: z.string().min(1, { message: 'Password confirmation is required' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords does not match'
})
