import { Request, Response } from "express";
import { body } from "express-validator";

import { tokenValidation } from "@middlewares/auth";
import { prisma } from "@tools/prisma";
import { decodeJWT } from "@tools/jwt";

export const authorizeUser = (
  req: Request,
  res: Response,
  next: () => void,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      res.status(401).json({ error: "unauthorized" })
  }
  const token = authHeader?.split(' ')[1];
  if (!token) {
      res.status(401).json({ error: "unauthorized" })
      return
  }
  try{
      const decoded = decodeJWT(token)
      if (typeof(decoded) == 'string') {
          throw new Error(decoded)    
      }
      res.locals.user_id = decoded.user_id
      res.locals.authenticated = true
      next()
  } catch (err) {
      res.status(401).json({ error: "invalid credential" })
      return
  }
}

export const validateRegisterUser = [
  body('firstname').notEmpty().withMessage("nama pertama tidak boleh kosong").bail({ level: "request" }),
  body('email').notEmpty().withMessage("email tidak boleh kosong").bail({ level: "request" }),
  body('email').custom(async value => {
      const user = await prisma.users.findFirst({
          select: {email: true},
          where: {email: value}
      })
      if (user) {
        throw new Error('email sudah terdaftar');
      }
    }).bail({ level: "request" }),
  body('password').notEmpty().withMessage("password tidak boleh kosong").bail({ level: "request" })
]

export const validateLoginuser = [
  body('email').notEmpty().withMessage("email tidak boleh kosong").bail({ level: "request" }),
  body('password').notEmpty().withMessage("password tidak boleh kosong").bail({ level: "request" })
]

export const validateGetUserProfile = [
  tokenValidation,
  authorizeUser,
]