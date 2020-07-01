import { ITournament } from "./ITournament";
import { ITournamentElementsFactory } from "./ITournamentElementsFactory";
import { IPlayer } from "./IPlayer";
import { IRanking } from "./IRanking";
import { IRound } from "./IRound";
import { IMatch } from "./IMatch";

export interface ITournamentFactory<TPlayer extends IPlayer, 
                                    TMatch extends IMatch<TPlayer>, 
                                    TRanking extends IRanking<TPlayer>, 
                                    TRound extends IRound<TPlayer, TMatch>>
{

    /**
     * Returns an instance of an unknown type of tournament of an unknown game
     * @param name 
     * @param startingDate 
     * @param tournamentElementsFactory The factory of the elements of the game (player, match, ranking, round)
     * @param status 
     * @param players 
     * @param rankings 
     * @param rounds 
     * @param startedAt 
     * @param finishedAt 
     * @param id 
     */
    createTournament(name: string,
                     startingDate: number,
                     tournamentElementsFactory: ITournamentElementsFactory<TPlayer, TMatch, TRanking, TRound>,
                     status?: "open" | "pending" | "ongoing" | "finished",
                     players?: IPlayer[],
                     rankings?: TRanking[],
                     rounds?: TRound[],
                     startedAt?: number,
                     finishedAt?: number,
                     id?: string): ITournament<TPlayer, TMatch, TRanking, TRound>

}