import { AbstractMatchDAO } from "../AbstractMatchDAO";
import { Match } from "../../model/StarcraftTournament/StarcraftMatch";
import { Db } from "../../firebase/Db";
import { assignDefined } from '../../utils/assignDefined'

export class FirebaseMatchDAO extends AbstractMatchDAO {

    async create(match: Match): Promise<string> {
        const target = assignDefined({}, match);
        target.participant1 = assignDefined({}, target.participant1);
        target.participant2 = assignDefined({}, target.participant2);

        const result = await Db.collection('matches').add(target);
        return result.id;
    }

    async update(match: Match): Promise<void> {
        const target = assignDefined({}, match);
        target.participant1 = assignDefined({}, target.participant1);
        target.participant2 = assignDefined({}, target.participant2);

        if(match.id)
            await Db.collection('matches').doc(match.id).update(target);
        else
        throw new Error("Match failed in update. Id not valid.")
    }

    async delete(id: string): Promise<void> {
        await Db.collection('matches').doc(id).delete();
    }

}