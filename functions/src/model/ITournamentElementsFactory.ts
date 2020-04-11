import { IMatch } from "./IMatch";
import { IRanking } from "./IRanking";
import { IPlayer } from "./IPlayer";
import { IRound } from "./IRound";

export interface ITournamentElementsFactory {

    createTournamentMatch(  players?: IPlayer[],
                            result?: number[],
                            status?: "waiting" | "pending" | "ongoing" | "finished",
                            startedAt?: number | null,
                            finishedAt?: number | null): IMatch;

    createTournamentRanking(player: IPlayer,
                            scoreFor?: number,
                            against?: number,
                            wins?: number,
                            draws?: number,
                            loses?: number): IRanking;

    createTournamentRound(  matches?: IMatch[],
                            status?: "pending" | "ongoing" | "finished",
                            startedAt?: number,
                            finishedAt?: number): IRound;
}