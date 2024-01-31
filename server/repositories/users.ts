import { DataTypes } from "sequelize"
import { sq, defaultInsertOptions } from "@tools/sequelize"

const User = sq.define('User', {
    // Model attributes are defined here
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    tableName: 'users',
    ...defaultInsertOptions,
  });


interface RegisterUserParams {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}
export const registerUser = async({
    firstname,
    lastname,
    email,
    password,
}: RegisterUserParams) => {
    return await User.create({
        firstname, 
        lastname,
        email,
        password
    })
}

export const findUserByEmail = async(email: string) => {
    return await User.findOne({ where: { email: email }})
}

export const findUserByID = async(id: number) => {
    return await User.findOne({ where: { id: id }})
}