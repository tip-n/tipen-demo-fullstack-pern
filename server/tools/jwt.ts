import jsonwebtoken from "jsonwebtoken"

const secret = process.env.JWT_SIGNATURE_KEY || ""

export const generateJWT = (claims: any) => {
    return jsonwebtoken.sign(
        claims,
        secret,
        {
            expiresIn: '24h'
        }
    )
}

export const decodeJWT = (token: string) => {
    return jsonwebtoken.verify(token , secret)
}