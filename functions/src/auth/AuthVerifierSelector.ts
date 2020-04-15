import { AuthProviderType } from "./AuthProviderType";
import { FirebaseAuthTokenVerifier } from "./FirebaseAuthTokenVerifier";

export class AuthVerifierSelector {

    public static getAuthVerifier(type: AuthProviderType){
        switch (type) {
            case AuthProviderType.Firebase:
                return new FirebaseAuthTokenVerifier();
            default:
                throw new Error("Invalid AuthProvider type");
        }
    }

}