import { IAuthTokenVerifier } from "./IAuthTokenVerifier";
import { Auth } from "../firebase/Auth";

export class FirebaseAuthTokenVerifier implements IAuthTokenVerifier {

    async verify(token: string): Promise<void> {
        await Auth.verifyIdToken(token);
    }

}