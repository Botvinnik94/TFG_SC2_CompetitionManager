import { AbstractCompetitionDAO } from "../AbstractCompetitionDAO";
import { Competition } from "../../model/Competition";
//import { assignDefined } from "../../utils/assignDefined"
import { Db } from '../../firebase/Db';
import { Bot } from "../../model/Bot";
//import * as admin from 'firebase-admin'
/*
export const competitionConverter = {
    toFirestore(competition: Competition): admin.firestore.DocumentData {
        const data = assignDefined({}, competition);
        return data;
    },
    fromFirestore(
        snapshot: admin.firestore.QueryDocumentSnapshot,
    ): Competition {
        const data = snapshot.data();
        return new Competition([], data.name, data.type, data.rounds, 
                                data.rankings, data.status, data.startingDate, 
                                data.startedAt, data.finishedAt, snapshot.id);
    }
}

export const botConverter = {
    toFirestore(bot: Bot): admin.firestore.DocumentData {
        const data = assignDefined({}, bot);
        return data;
    },
    fromFirestore(
        snapshot: admin.firestore.QueryDocumentSnapshot,
    ): Bot {
        const data = snapshot.data()!;
        return new Bot(data.name, data.uid, data.script, data.race, data.elo, snapshot.id, data.username, data.useravatar);
    }
}
*/
export class FirebaseCompetitionDAO extends AbstractCompetitionDAO {

    async findOne(id: string): Promise<Competition> {
        const snapshot = await Db.collection('competitions')
                                    //.withConverter(competitionConverter)
                                    .doc(id)
                                    .get();

        const data = snapshot.data()!;
        const competition = new Competition([], data.name, data.type, data.rounds, 
                                            data.rankings, data.status, data.startingDate, 
                                            data.startedAt, data.finishedAt, snapshot.id);
        if(competition) {
            competition.participants = await this.getParticipantsFromCompetition(id);
            return competition;
        }
        else {
            throw new Error("Competition not found in DB");
        }
    }

    async update(competition: Competition): Promise<void> {

        const target = {
            name: competition.name,
            type: competition.type,
            rounds: competition.rounds,
            status: competition.status,
            startingDate: competition.startingDate,
            startedAt: competition.startedAt,
            finishedAt: competition.finishedAt
        };


        if(competition.id)
            await Db.collection('competitions').doc(competition.id).update(target);
        else
            throw new Error("Competition failed in update. Id not valid.")

    }

    async delete(id: string): Promise<void> {

        await Db.collection('competitions').doc(id).delete();

    }

    // Helpers

    async getParticipantsFromCompetition(competitionId: string): Promise<Bot[]> {
        const participantsSnapshot = await Db.collection('competitions')
                                                .doc(competitionId)
                                                .collection('participants')
                                                //.withConverter(botConverter)
                                                .get();

        const participants = participantsSnapshot.docs.map( botSnap => {
            const data = botSnap.data()!;
            return new Bot(data.name, data.uid, data.script, data.race, data.elo, botSnap.id, data.username, data.useravatar);
        });

        return participants;
    }
}