import { ITournamentFactory } from "../ITournamentFactory";
import { RoundRobin } from "./RoundRobin";
import { ITournamentElementsFactory } from "../ITournamentElementsFactory";
import { IPlayer } from "../IPlayer";
import { IRanking } from "../IRanking";
import { IRound } from "../IRound";
import { IMatch } from "../IMatch";

export class RoundRobinFactory< TPlayer extends IPlayer,
                                TMatch extends IMatch<TPlayer>,
                                TRanking extends IRanking<TPlayer>,
                                TRound extends IRound<TPlayer, TMatch>> 

implements ITournamentFactory<TPlayer, TMatch, TRanking, TRound> {

    /**
     * Returns an instance of a Round-Robin type of tournament of an unknown game
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
                     players?: TPlayer[],
                     rankings?: TRanking[],
                     rounds?: TRound[],
                     startedAt?: number,
                     finishedAt?: number,
                     id?: string): RoundRobin <TPlayer, TMatch, TRanking, TRound>
    {
        return new RoundRobin(  name,
                                rounds ?? [],
                                rankings ?? [],
                                players ?? [],
                                status ?? "open",
                                startingDate,
                                startedAt ?? null,
                                finishedAt ?? null,
                                tournamentElementsFactory,
                                id);
    }

}