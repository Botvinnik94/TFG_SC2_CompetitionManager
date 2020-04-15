import { AuthVerifierSelector } from "../auth/AuthVerifierSelector";
import { AuthProviderType } from "../auth/AuthProviderType";

export async function auth(req: any, res: any, next: any) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verifierService = AuthVerifierSelector.getAuthVerifier(AuthProviderType.Firebase);
        // const authorizationService = AuthorizationSelector.getAuthorizationProvider(AuthProviderType.Firebase);
        await verifierService.verify(token);
        // try {
        //     await authorizationService.authorize(uid);
        // }
        // catch(error) {
        //     console.error(error);
        //     res.sendStatus(403);
        // }
        next();
    }
    catch(error) {
        console.error(error);
        res.sendStatus(401);
    }
}