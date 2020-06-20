import { AbstractMatchDAO } from "../AbstractMatchDAO";
import { StarcraftMatch } from "../../model/StarcraftTournamentElements/StarcraftMatch";
import { Db } from "../../firebase/Db";
import { Bot } from "../../model/StarcraftTournamentElements/Bot";
import { StarcraftMatchFirestoreConverter } from "./Converters/StarcraftMatchFirestoreConverter";
import { IMatchFilter } from "../../model/IMatchFilter";

export class FirebaseStarcraftMatchDAO extends AbstractMatchDAO<Bot, StarcraftMatch> {

    async find(matchFilter?: IMatchFilter, limit?: number): Promise<StarcraftMatch[]> {

        let query: any = Db.collection('matches')

        if(matchFilter?.status) {
            query = query.where("status", "==", matchFilter.status);
        }

        if(matchFilter?.tournamentId) {
            query = query.where('tournamentId', '==', matchFilter.tournamentId)
        }

        query = query.orderBy('finishedAt', 'desc')

        // If there is a limit and we don't filter with players we ask directly Firestore for the limit
        // Otherwise, limits are handled in the special case below
        if(limit && matchFilter?.playersId == undefined) {
            query = query.limit(limit)
        }

        const snapshot = await query.get()
        const converter = new StarcraftMatchFirestoreConverter();
        let matches = snapshot.docs.map( (data: any) => {
            const match = converter.fromFirestore(data);
            if(match) return match;
            else throw new Error(`Match not found in DB`)
        })

        // Firestore doesn't support array-contains queries with object like elements, we have to do it here
        if(matchFilter?.playersId) {
            matches = matches.filter( (match: StarcraftMatch) => {
                let bot = match.players.find( player => {
                    if(matchFilter.playersId != undefined && matchFilter.playersId[0] != undefined) {
                        return player.id === matchFilter.playersId[0]
                    }
                    else{
                        return true
                    }
                })
                let bot2 = match.players.find( player => {
                    if(matchFilter.playersId != undefined && matchFilter.playersId[1] != undefined) {
                        return player.id === matchFilter.playersId[1]
                    }
                    else {
                        return true
                    }
                })
                return (bot != undefined && bot2 != undefined)
            })

            if(limit) {
                matches = matches.slice(0, limit)
            }
        }

        return matches;
    }

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