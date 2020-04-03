import { AbstractMatchDAO } from "../AbstractMatchDAO";
import { Match } from "../../model/Match";
import { Db } from "../../firebase/Db";

export class FirebaseMatchDAO extends AbstractMatchDAO {

    async create(match: Match): Promise<string> {
        const result = await Db.collection('matches').add(match);
        return result.id;
    }

    async update(match: Match): Promise<void> {
        await Db.collection('matches').doc(match.id).update(match);
    }

    async delete(id: string): Promise<void> {
        await Db.collection('matches').doc(id).delete();
    }

}