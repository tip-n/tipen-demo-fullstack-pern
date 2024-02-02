import { Request, Response } from "express";
import { body } from "express-validator";

import { tokenValidation } from "@middlewares/auth";
import { prisma } from "@tools/prisma";
import { decodeJWT } from "@tools/jwt";

export const authorizeSeller = (
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
      res.locals.seller_id = decoded.seller_id
      res.locals.authenticated = true
      next()
  } catch (err) {
      res.status(401).json({ error: "invalid credential" })
      return
  }
}

export const validateRegisterSeller = [
  body('storename').notEmpty().withMessage("nama toko tidak boleh kosong").bail({ level: "request" }),
  body('email').notEmpty().withMessage("email tidak boleh kosong").bail({ level: "request" }),
  body('email').custom(async value => {
      const seller = await prisma.sellers.findFirst({
          select: {email: true},
          where: {email: value}
      })
      if (seller) {
        throw new Error('email sudah terdaftar');
      }
    }).bail({ level: "request" }),
  body('password').notEmpty().withMessage("password tidak boleh kosong").bail({ level: "request" })
]

export const validateLoginseller = [
  body('email').notEmpty().withMessage("email tidak boleh kosong").bail({ level: "request" }),
  body('password').notEmpty().withMessage("password tidak boleh kosong").bail({ level: "request" })
]

export const validateGetSellerProfile = [
  tokenValidation,
  authorizeSeller,
]

export const validateUpdateSellerProfileFields = (
  req: Request,
  res: Response,
  next: () => void,
) => {
  if (!req.body.firstname && !req.body.lastname) {
    res.status(400).json({ error: "tidak ada perubahan" })
    return
  }
  next() 
}

export const validateUpdateSellerProfile = [
  tokenValidation,
  authorizeSeller,
  validateUpdateSellerProfileFields,
]
