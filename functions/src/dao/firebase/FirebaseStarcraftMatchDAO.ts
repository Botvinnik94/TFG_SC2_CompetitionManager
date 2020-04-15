import { AbstractMatchDAO } from "../AbstractMatchDAO";
import { StarcraftMatch } from "../../model/StarcraftTournamentElements/StarcraftMatch";
import { Db } from "../../firebase/Db";
import { Bot } from "../../model/StarcraftTournamentElements/Bot";
import { StarcraftMatchFirestoreConverter } from "./Converters/StarcraftMatchFirestoreConverter";

export class FirebaseStarcraftMatchDAO extends AbstractMatchDAO<Bot, StarcraftMatch> {

    async findOne(id: string): Promise<StarcraftMatch> {

        const snapshot = await Db.collection('matches').doc(id).get();
        const converter = new StarcraftMatchFirestoreConverter();
        const match = converter.fromFirestore(snapshot);
        if(match) {
            return match;
        }
        else {
            throw new Error(`Match ${id} not found in DB.`)
        }

    }

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