import { ISerializer } from "./ISerializer";
import { ITournament } from "../../model/ITournament";
import { Bot } from "../../model/StarcraftTournamentElements/Bot";
import { StarcraftMatch } from "../../model/StarcraftTournamentElements/StarcraftMatch";
import { StarcraftRanking } from "../../model/StarcraftTournamentElements/StarcraftRanking";
import { StarcraftRound } from "../../model/StarcraftTournamentElements/StarcraftRound";
import { assignDefined } from "../assignDefined";

export class StarcraftTournamentSerializer implements ISerializer<ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>> {

    serialize(tournament: ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>): string {
        const documentData: any = {
            id: tournament.id,
            name: tournament.name,
            status: tournament.status,
            type: tournament.type,
            startingDate: tournament.startingDate,
            startedAt: tournament.startedAt,
            finishedAt: tournament.finishedAt
        };

        documentData.rounds = tournament.rounds.map( round => {
            return {
                status: round.status,
                startedAt: round.startedAt,
                finishedAt: round.finishedAt,
                matches: round.matches.map( match => {
                            return {
                                id: match.id,
                                tournamentId: match.tournamentId,
                                indexId: match.indexId,
                                players: match.players.map( player => {
                                    return assignDefined({}, player);
                                }),
                                bestOf: match.bestOf,
                                games: match.games.map( game => {
                                    return assignDefined({}, game)
                                }),
                                result: match.result,
                                status: match.status,
                                startedAt: match.startedAt,
                                finishedAt: match.finishedAt
                            }
                        })
            };
        });

        documentData.rankings = tournament.rankings.map( ranking => {
            return {
                player: assignDefined({}, ranking.player),
                for: ranking.for,
                against: ranking.against,
                wins: ranking.wins,
                draws: ranking.draws,
                loses: ranking.loses
            };
        });

        documentData.players = tournament.players.map( player => {
            return assignDefined({}, player)
        });

        return documentData;
    }

    unserialize(json: string): ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> | undefined {
        throw new Error("Method not implemented.");
    }

}