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

    /**
     * Returns an instance of a match from an unknown game
     * @param indexId 
     * @param tournamentId 
     * @param players 
     * @param result 
     * @param status 
     * @param startedAt 
     * @param finishedAt 
     * @param id 
     */
    createTournamentMatch(  indexId: IndexId,
                            tournamentId?: string,
                            players?: TPlayer[],
                            result?: number[],
                            status?: "waiting" | "pending" | "ongoing" | "finished",
                            startedAt?: number | null,
                            finishedAt?: number | null,
                            id?: string): TMatch;

    /**
     * Returns an instance of a ranking from an unknown game
     * @param player 
     * @param scoreFor 
     * @param against 
     * @param wins 
     * @param draws 
     * @param loses 
     */
    createTournamentRanking(player: TPlayer,
                            scoreFor?: number,
                            against?: number,
                            wins?: number,
                            draws?: number,
                            loses?: number): TRanking;

    /**
     * Returns an instance of a round from an unknown game
     * @param matches 
     * @param status 
     * @param startedAt 
     * @param finishedAt 
     */
    createTournamentRound(  matches?: TMatch[],
                            status?: "pending" | "ongoing" | "finished",
                            startedAt?: number,
                            finishedAt?: number): TRound;
}