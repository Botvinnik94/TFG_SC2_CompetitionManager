import { IUser } from "./model/IUser";

export interface IAuthTokenVerifier {

    /**
     * Returns the data of the corresponding user from a JWT token
     * @param token 
     */
    verify(token: string): Promise<IUser>;

}