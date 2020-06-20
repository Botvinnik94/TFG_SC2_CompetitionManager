import { IAuthTokenVerifier } from "./IAuthTokenVerifier";
import { Auth } from "../firebase/Auth";
import { Db } from "../firebase/Db";
import { IUser } from "./model/IUser";
import { Bot } from "../model/StarcraftTournamentElements/Bot";

export class FirebaseAuthTokenVerifier implements IAuthTokenVerifier {

    async verify(token: string): Promise<IUser> {
        const decodedToken = await Auth.verifyIdToken(token);
        const snapshot = await Db.collection('users').doc(decodedToken.uid).get();

        if(snapshot.exists && snapshot.data() != undefined) {
            const bots: Bot[] = snapshot.data()?.bots.map((bot: any) => {
                return new Bot(bot.id, bot.name, bot.uid, bot.script, bot.race, bot.elo)
            });
            const user: IUser = {
                uid: snapshot.data()?.id,
                name: snapshot.data()?.name,
                isAdmin: snapshot.data()?.isAdmin ?? false,
                bots: bots
            }
            return user;
        }
        else {
            throw new Error("Invalid user")
        }
    }

}