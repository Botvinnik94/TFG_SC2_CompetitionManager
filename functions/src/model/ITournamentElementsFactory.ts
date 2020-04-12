import { IMatch } from "./IMatch";
import { IRanking } from "./IRanking";
import { IPlayer } from "./IPlayer";
import { IRound } from "./IRound";
import { IndexId } from "./IndexId";

export interface ITournamentElementsFactory<TPlayer extends IPlayer, 
                                            TMatch extends IMatch<TPlayer>, 
                                            TRanking extends IRanking<TPlayer>, 
                                            TRound extends IRound<TPlayer, TMatch>>
{

    createTournamentMatch(  indexId: IndexId,
                            tournamentId?: string,
                            players?: TPlayer[],
                            result?: number[],
                            status?: "waiting" | "pending" | "ongoing" | "finished",
                            startedAt?: number | null,
                            finishedAt?: number | null,
                            id?: string): TMatch;

    createTournamentRanking(player: TPlayer,
                            scoreFor?: number,
                            against?: number,
                            wins?: number,
                            draws?: number,
                            loses?: number): TRanking;

    createTournamentRound(  matches?: TMatch[],
                            status?: "pending" | "ongoing" | "finished",
                            startedAt?: number,
                            finishedAt?: number): TRound;
}