import { Request, Response } from "express"
import { validationResult } from "express-validator";

import { comparePassword, hashPassword } from "@tools/crypto";
import { prisma } from "@tools/prisma";
import { generateJWT } from "@tools/jwt";
import { logger } from "@tools/winston";


export const registerSellerController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
      return
    }

    const { storename, password, email } = req.body
    const hashed = hashPassword(password)
    try {
        const seller = await prisma.sellers.create({
            data: {
                storename: storename,
                email: email,
                password: hashed
            }
        })
        res.status(200).json({ seller_id: seller.id })
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: "internal server error"})
    }
}


export const loginSellerController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return
    }

    const { email, password } = req.body
    try {
        const seller = await prisma.sellers.findFirst({
            select: {id: true, password: true},
            where: {email: email}
        })
        if (!seller) {
            res.status(500).json({ error: "email atau password salah" })
            return
        }
        if (!comparePassword(password, seller.password)) {
            res.status(500).json({ error: "email atau password salah" })
        }

        await prisma.seller_logins.create({
            data: {
                seller_id: seller.id
            }
        })

        const access_token = generateJWT({seller_id: seller.id})
        res.status(200).json({ access_token })
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getSellerProfileController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg })
        return
    }
    
    try {
        const seller = await prisma.sellers.findFirst({
            select: {storename: true, email: true},
            where: {id: res.locals.seller_id}
        })
        if (!seller) {
            res.status(500).json({ error: "invalid credential"})
            return
        }
        res.status(200).json({ ...seller })
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: "internal server error" })
    }
}

export const updateSellerProfileController = async (req: Request, res: Response) => {
    try {
        let data = {}
        if (req.body.storename) {
            data = {
                ...data,
                storename: req.body.storename,
            }
        }
        await prisma.sellers.update({
            where: {id: res.locals.seller_id},
            data
        })
        res.status(200).json("successfully updated")
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: "internal server error" })
    }
}