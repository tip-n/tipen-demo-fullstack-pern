import {
    registerUser,
} from "@repositories/users"

interface RegisterUserParams {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export const registerUserService = async ({
    firstname,
    lastname,
    email,
    password,
}: RegisterUserParams) => {
    const user = await registerUser({
        firstname,
        lastname,
        email,
        password
    }).then((resp) => resp)
    return user.id
}