import { body } from "express-validator";

export const validateRegisterUser = [
    body('firstname').notEmpty().withMessage("nama pertama tidak boleh kosong"),
    body('email').notEmpty().withMessage("email tidak boleh kosong"),
    body('password').notEmpty().withMessage("password tidak boleh kosong")
]