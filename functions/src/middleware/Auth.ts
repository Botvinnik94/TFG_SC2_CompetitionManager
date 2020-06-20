import { AuthVerifierSelector } from "../auth/AuthVerifierSelector";
import { AuthProviderType } from "../auth/AuthProviderType";

export async function simpleAuth(req: any, res: any, next: any) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verifierService = AuthVerifierSelector.getAuthVerifier(AuthProviderType.Firebase);
        await verifierService.verify(token);
        next();
    }
    catch(error) {
        console.error(error);
        res.sendStatus(401);
    }
}

export async function botAuth(req: any, res: any, next: any) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verifierService = AuthVerifierSelector.getAuthVerifier(AuthProviderType.Firebase);
        const user = await verifierService.verify(token);
        const botId = req.body.player
        const botWanted = user.bots.find( value => {
            return value.id === botId
        })
        if(botWanted != undefined) {
            next();
        }
        else {
            console.error(`Bot ${botId} is not owned by ${user.uid}`);
            res.sendStatus(401);
        }
    }
    catch(error) {
        console.error(error);
        res.sendStatus(401);
    }
}


export async function adminAuth(req: any, res: any, next: any) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verifierService = AuthVerifierSelector.getAuthVerifier(AuthProviderType.Firebase);
        const user = await verifierService.verify(token);
        if(user.isAdmin) {
            next();
        }
        else {
            console.error(`User ${user.uid} is not admin`)
            res.sendStatus(401);
        }
    }
    catch(error) {
        console.error(error);
        res.sendStatus(401);
    }
}