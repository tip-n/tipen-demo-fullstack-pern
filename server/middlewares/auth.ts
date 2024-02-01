import { header } from "express-validator";

export const tokenValidation = header('authorization').notEmpty().withMessage("token tidak boleh kosong")
