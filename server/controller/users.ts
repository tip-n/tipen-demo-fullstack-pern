import { Request, Response } from "express"
import { validationResult } from "express-validator";

import { comparePassword, hashPassword } from "@tools/crypto";
import { prisma } from "@tools/prisma";
import { generateJWT } from "@tools/jwt";
import { logger } from "@tools/winston";


export const registerUserController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
      return
    }

    const { firstname, lastname, password, email } = req.body
    const hashed = hashPassword(password)
    try {
        const user = await prisma.users.create({
            data: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hashed
            }
        })
        res.status(200).json({ user_id: user.id })
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: "internal server error"})
    }
}


export const loginUserController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return
    }

    const { email, password } = req.body
    try {
        const user = await prisma.users.findFirst({
            select: {id: true, password: true},
            where: {email: email}
        })
        if (!user) {
            res.status(500).json({ error: "username atau password salah" })
            return
        }
        if (!comparePassword(password, user.password)) {
            res.status(500).json({ error: "username atau password salah" })
        }

        await prisma.user_logins.create({
            data: {
                user_id: user.id
            }
        })

        const access_token = generateJWT({user_id: user.id})
        res.status(200).json({ access_token })
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getUserProfileController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg })
        return
    }
    
    try {
        const user = await prisma.users.findFirst({
            select: {firstname: true, lastname: true, email: true},
            where: {id: res.locals.user_id}
        })
        if (!user) {
            res.status(500).json({ error: "invalid credential"})
            return
        }
        res.status(200).json({ ...user })
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: "internal server error" })
    }
}

export const updateUserProfileController = async (req: Request, res: Response) => {
    try {
        let data = {}
        if (req.body.firstname) {
            data = {
                ...data,
                firstname: req.body.firstname,
            }
        }
        if (req.body.lastname) {
            data = {
                ...data,
                lastname: req.body.lastname,
            }
        }
        await prisma.users.update({
            where: {id: res.locals.user_id},
            data
        })
        res.status(200).json("successfully updated")
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: "internal server error" })
    }
}