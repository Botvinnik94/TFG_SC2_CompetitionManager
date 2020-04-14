import { ITournamentElementsFactory } from "../ITournamentElementsFactory";
import { StarcraftMatch } from "./StarcraftMatch";
import { StarcraftRanking } from "./StarcraftRanking";
import { StarcraftRound } from "./StarcraftRound";
import { IStarcraftGame } from "./IStarcraftGame";
import { IndexId } from "../IndexId";
import { Bot } from "./Bot";

export class StarcraftTournamentElementsFactory implements ITournamentElementsFactory<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> {

    createTournamentMatch(  indexId: IndexId,
                            tournamentId?: string,
                            players?: Bot[],
                            result?: number[],
                            status?: "waiting" | "pending" | "ongoing" | "finished",
                            startedAt?: number,
                            finishedAt?: number,
                            id?: string,
                            games?: IStarcraftGame[],
                            bestOf?: number): StarcraftMatch
    {
        if(!bestOf || bestOf % 2 !== 0) {
            return new StarcraftMatch(indexId, players ?? [], result ?? [0,0], bestOf ?? 3, games ?? [], status ?? "waiting", startedAt ?? null, finishedAt ?? null, tournamentId, id);
        }
        else {
            throw new Error("BestOf parameter must be an odd number");
        }
    }

    createTournamentRanking(player: Bot,
                            scoreFor?: number,
                            scoreAgainst?: number,
                            wins?: number,
                            draws?: number,
                            loses?: number): StarcraftRanking
    {
        return new StarcraftRanking(player, scoreFor ?? 0, scoreAgainst ?? 0, wins ?? 0, draws ?? 0, loses ?? 0);
    }

    createTournamentRound(  matches?: StarcraftMatch[],
                            status?: "pending" | "ongoing" | "finished",
                            startedAt?: number,
                            finishedAt?: number): StarcraftRound
    {
        return new StarcraftRound(matches ?? [], status ?? "pending", startedAt ?? null, finishedAt ?? null);
    }

}