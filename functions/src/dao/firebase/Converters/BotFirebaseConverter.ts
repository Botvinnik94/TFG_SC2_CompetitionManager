import { IFirestoreConverter } from "./IFirestoreConverter";
import { Bot } from "../../../model/StarcraftTournamentElements/Bot";
import { assignDefined } from "../../../utils/assignDefined";

export class BotFirebaseConverter implements IFirestoreConverter<Bot> {

    toFirestore(bot: Bot): FirebaseFirestore.DocumentData {
        return assignDefined({}, bot);
    }
    fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): Bot | undefined {
        const data = snapshot.data();
        if(data) return new Bot(snapshot.id, data.name, data.uid, data.script, data.race, data.elo, data.username, data.useravatar);
        else return undefined;
    }

}