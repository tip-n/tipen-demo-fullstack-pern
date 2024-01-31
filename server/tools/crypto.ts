import bcrypt from "bcrypt"

const saltRounds = 10;

export const hashPassword = (password: string) => {
    let hashedPassword = ""
    bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
        hashedPassword = hash
    });
    return hashedPassword
}