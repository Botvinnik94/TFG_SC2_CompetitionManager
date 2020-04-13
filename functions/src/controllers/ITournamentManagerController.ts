import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";
import { ITournament } from "../model/ITournament";

export interface ITournamentManagerController<  TPlayer extends IPlayer, 
                                                TMatch extends IMatch<TPlayer>, 
                                                TRanking extends IRanking<TPlayer>, 
                                                TRound extends IRound<TPlayer, TMatch>> 
{

    // Public tournament api
    getTournament(tournamentId: string): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>>;
    createTournament(type: string, name: string, startingDate: number): Promise<void>;
    deleteTournament(tournamentId: string): Promise<void>;

    // Public tournament service api
    enrollPlayer(playerId: string, tournamentId: string): Promise<void>;
    withdrawPlayer(playerId: string, tournamentId: string): Promise<void>;

    // Private tournament service api
    initializeTournament(tournamentId: string): Promise<void>
    //startMatch
    //reportMatch
}