import { ITournamentElementsFactory } from "../ITournamentElementsFactory";
import { StarcraftMatch } from "./StarcraftMatch";
import { StarcraftRanking } from "./StarcraftRanking";
import { IPlayer } from "../IPlayer";
import { StarcraftRound } from "./StarcraftRound";
import { IStarcraftGame } from "./IStarcraftGame";

export class StarcraftTournamentElementsFactory implements ITournamentElementsFactory {

    createTournamentMatch(  players?: IPlayer[],
                            result?: number[],
                            status?: "waiting" | "pending" | "ongoing" | "finished",
                            startedAt?: number,
                            finishedAt?: number,
                            games?: IStarcraftGame[],
                            bestOf?: number): StarcraftMatch
    {
        return new StarcraftMatch(players ?? [], result ?? [0,0], bestOf ?? 3, games ?? [], status ?? "waiting", startedAt ?? null, finishedAt ?? null)
    }

    createTournamentRanking(player: IPlayer,
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