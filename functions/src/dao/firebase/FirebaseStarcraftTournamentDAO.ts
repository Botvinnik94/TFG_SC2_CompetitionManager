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

    async find(tournamentFilter: ITournamentFilter, limit?: number): Promise<ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>[]> {

        let query: any = Db.collection('tournaments')

        if(tournamentFilter?.status) {
            query = query.where("status", "==", tournamentFilter.status);
        }

        if(tournamentFilter?.type) {
            query = query.where('type', '==', tournamentFilter.type)
        }

        if(tournamentFilter?.fromDate) {
            query = query.where('finishedAt', '>=', tournamentFilter.fromDate)
        }

        if(tournamentFilter?.toDate) {
            query = query.where('finishedAt', '<=', tournamentFilter.toDate)
        }

        query = query.orderBy('finishedAt', 'desc')

        if(limit) {
            query = query.limit(limit)
        }

        const snapshot = await query.get()
        const converter = new StarcraftTournamentFirestoreConverter();
        let tournaments = snapshot.docs.map( async (data: any) => {
            const tournament = converter.fromFirestore(data);
            if(tournament) {
                tournament.players = await this.getPlayersFromCompetition(tournament.id ?? '');
                return tournament;
            }
            else throw new Error(`Tournament not found in DB`)
        });

        return await Promise.all(tournaments);
    }

    async create(tournament: ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>): Promise<string> {

        const converter = new StarcraftTournamentFirestoreConverter();
        const target = converter.toFirestore(tournament);

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
            const data = botSnap.data();
            return new Bot(botSnap.id, data.name, data.uid, data.script, data.race, data.elo, data.username, data.useravatar, data.tournamentWins);
        });

        return participants;
    }
}