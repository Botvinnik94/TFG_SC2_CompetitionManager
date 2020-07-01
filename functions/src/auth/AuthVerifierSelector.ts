import { AuthProviderType } from "./AuthProviderType";
import { FirebaseAuthTokenVerifier } from "./FirebaseAuthTokenVerifier";

export class AuthVerifierSelector {

    /**
     * Returns an instance of a Authentication Verifier Object
     * @param type The provider of the verification
     */
    public static getAuthVerifier(type: AuthProviderType){
        switch (type) {
            case AuthProviderType.Firebase:
                return new FirebaseAuthTokenVerifier();
            default:
                throw new Error("Invalid AuthProvider type");
        }
    }

}