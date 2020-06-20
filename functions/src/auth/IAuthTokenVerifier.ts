import { IUser } from "./model/IUser";

export interface IAuthTokenVerifier {

    verify(token: string): Promise<IUser>;

}