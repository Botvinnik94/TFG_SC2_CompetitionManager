import { ISerializer } from "./ISerializer";
import { StarcraftMatch } from "../../model/StarcraftTournamentElements/StarcraftMatch";
import { assignDefined } from "../assignDefined";

export class StarcraftMatchSerializer implements ISerializer<StarcraftMatch> {

    serialize(match: StarcraftMatch): string {
        const documentData: any = {
            id: match.id,
            tournamentId: match.tournamentId,
            indexId: match.indexId,
            players: match.players.map( player => {
                return assignDefined({}, player);
            }),
            bestOf: match.bestOf,
            games: match.games.map( game => {
                return {
                    participant1: assignDefined({}, game.participant1),
                    participant2: assignDefined({}, game.participant2),
                    winner: game.winner,
                    map: game.map,
                    replayURL: game.replayURL
                }
            }),
            result: match.result,
            status: match.status,
            startedAt: match.startedAt,
            finishedAt: match.finishedAt
        };

        return documentData;
    }

    unserialize(json: string): StarcraftMatch | undefined {
        throw new Error("Method not implemented.");
    }
}