import { assignDefined } from "../../utils/assignDefined"
import { Db } from '../../firebase/Db';
import { AbstractTournamentDAO } from "../AbstractTournamentDAO";
import { ITournamentFilter } from "../../model/ITournamentFilter";
import { ITournament } from "../../model/ITournament";
import { Bot } from '../../model/StarcraftTournamentElements/Bot';
import { StarcraftTournamentFirestoreConverter } from "./Converters/StarcraftTournamentFirestoreConverter";
import { StarcraftMatch } from "../../model/StarcraftTournamentElements/StarcraftMatch";
import { StarcraftRanking } from "../../model/StarcraftTournamentElements/StarcraftRanking";
import { StarcraftRound } from "../../model/StarcraftTournamentElements/StarcraftRound";

export class FirebaseStarcraftTournamentDAO extends AbstractTournamentDAO<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> {

    async enrollPlayer(player: Bot, tournamentId: string): Promise<void> {
        await Db.collection('tournaments').doc(tournamentId).collection('players').doc(player.id).set(assignDefined({}, player));
    }

    async withdrawPlayer(playerId: string, tournamentId: string): Promise<void> {
        await Db.collection('tournaments').doc(tournamentId).collection('players').doc(playerId).delete();
    }

    async find(tournamentFilter: ITournamentFilter): Promise<ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>[]> {
        throw new Error("Method not implemented.");
    }

    async create(tournament: ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>): Promise<string> {

        const target = {
            name: tournament.name,
            type: tournament.type,
            rounds: tournament.rounds,
            rankings: tournament.rankings,
            status: tournament.status,
            startingDate: tournament.startingDate,
            startedAt: tournament.startedAt,
            finishedAt: tournament.finishedAt
        };

        const result = await Db.collection('tournaments').add(target);
        tournament.id = result.id;
        return tournament.id;
    }

    async findOne(id: string): Promise<ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>> {
        const snapshot = await Db.collection('tournaments')
                                 .doc(id)
                                 .get();

        const converter = new StarcraftTournamentFirestoreConverter();
        const tournament = converter.fromFirestore(snapshot);
        if(tournament) {
            tournament.players = await this.getPlayersFromCompetition(id);
            return tournament;
        }
        else {
            throw new Error(`Tournament ${id} not found in DB`);
        }
    }

    async update(tournament: ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>): Promise<void> {

        if(tournament.id) {
            const converter = new StarcraftTournamentFirestoreConverter();
            const target = converter.toFirestore(tournament);
            await Db.collection('tournaments').doc(tournament.id).update(target);
        }
        else
            throw new Error("Competition failed in update. Id not valid.")

    }

    async delete(id: string): Promise<void> {
        await Db.collection('tournaments').doc(id).delete();
    }

    // Helpers

    async getPlayersFromCompetition(competitionId: string): Promise<Bot[]> {
        const participantsSnapshot = await Db.collection('tournaments')
                                                .doc(competitionId)
                                                .collection('players')
                                                .get();

        const participants = participantsSnapshot.docs.map( botSnap => {
            const data = botSnap.data()!;
            return new Bot(botSnap.id, data.name, data.uid, data.script, data.race, data.elo, data.username, data.useravatar);
        });

        return participants;
    }
}