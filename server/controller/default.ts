interface IError {
    status: number;
    msg: string
}

interface IResponse {
    data?: any
    err?: IError
}

export class DefaultResponse {
    data?: any;
    err?: IError;

    constructor(resp: IResponse) {
        this.data = resp.data;
        this.err = resp.err ? resp.err : {status: 500, msg: "unknown error"};
    }
}

export const InternalServerError = (msg: string): IError => {
    return {status: 500, msg}
}
export const BadRequestError = (msg: string): IError => {
    return {status: 400, msg}
}