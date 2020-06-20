import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";
import { ITournament } from "../model/ITournament";
import { IndexId } from "../model/IndexId";
import { IMatchFilter } from "../model/IMatchFilter";
import { ITournamentFilter } from "../model/ITournamentFilter";

export interface ITournamentManagerController<  TPlayer extends IPlayer, 
                                                TMatch extends IMatch<TPlayer>, 
                                                TRanking extends IRanking<TPlayer>, 
                                                TRound extends IRound<TPlayer, TMatch>> 
{

    // Public tournament & match api
    getTournament(tournamentId: string): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>>;
    getTournaments(tournamentFilter: ITournamentFilter, limit?: number): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>[]>;
    createTournament(type: string, name: string, startingDate: number): Promise<string>;
    deleteTournament(tournamentId: string): Promise<void>;

    getMatch(matchId: string): Promise<TMatch>
    getMatches(matchFilter: IMatchFilter, limit?: number): Promise<TMatch[]>

    // Public tournament service api
    enrollPlayer(playerId: string, tournamentId: string): Promise<void>;
    withdrawPlayer(playerId: string, tournamentId: string): Promise<void>;

    // Private tournament service api
    initializeTournament(tournamentId: string): Promise<void>
    startMatch(tournamentId: string, indexId: IndexId): Promise<void>
    reportMatch(tournamentId: string, indexId: IndexId, reportObject: Object): Promise<void>
}