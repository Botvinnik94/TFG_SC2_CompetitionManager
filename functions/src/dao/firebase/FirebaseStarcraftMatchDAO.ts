import { AbstractMatchDAO } from "../AbstractMatchDAO";
import { StarcraftMatch } from "../../model/StarcraftTournamentElements/StarcraftMatch";
import { Db } from "../../firebase/Db";
import { Bot } from "../../model/StarcraftTournamentElements/Bot";
import { StarcraftMatchFirestoreConverter } from "./Converters/StarcraftMatchFirestoreConverter";

export class FirebaseStarcraftMatchDAO extends AbstractMatchDAO<Bot, StarcraftMatch> {

    async create(match: StarcraftMatch): Promise<string> {

        const converter = new StarcraftMatchFirestoreConverter();
        const target = converter.toFirestore(match);

        const result = await Db.collection('matches').add(target);
        match.id = result.id;
        return match.id;

    }

    async update(match: StarcraftMatch): Promise<void> {

        if(match.id) {
            const converter = new StarcraftMatchFirestoreConverter();
            const target = converter.toFirestore(match);
            await Db.collection('matches').doc(match.id).update(target);
        }
        else
            throw new Error("Match failed in update. Id not valid.")
    }

    async delete(id: string): Promise<void> {
        await Db.collection('matches').doc(id).delete();
    }

}