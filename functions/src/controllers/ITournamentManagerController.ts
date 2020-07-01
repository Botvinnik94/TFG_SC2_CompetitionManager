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
    /**
     * Returns a tournament given its id
     * @param tournamentId 
     */
    getTournament(tournamentId: string): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>>;

    /**
     * Returns a list of tournaments that meet certain criteria
     * @param tournamentFilter The filtering criteria
     * @param limit Limits the amount of results returned
     */
    getTournaments(tournamentFilter: ITournamentFilter, limit?: number): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>[]>;

    /**
     * Adds a new tournament to the platform
     * @param type The tournament type (round-robin)
     * @param name The tournament name
     * @param startingDate Starting date for the tournament
     */
    createTournament(type: string, name: string, startingDate: number): Promise<string>;

    /**
     * Deletes a tournament from the platform
     * @param tournamentId The id of the tournament to delete
     */
    deleteTournament(tournamentId: string): Promise<void>;

    /**
     * Returns a match given its id
     * @param matchId 
     */
    getMatch(matchId: string): Promise<TMatch>

    /**
     * Returns a list of matches that meet certain criteria
     * @param matchFilter The match filtering criteria
     * @param limit Limits de amount of results returned
     */
    getMatches(matchFilter: IMatchFilter, limit?: number): Promise<TMatch[]>

    // Public tournament service api
    /**
     * Registers a player in a tournament
     * @param playerId The id of the player to register
     * @param tournamentId The id of the tournament the player is registering in
     */
    enrollPlayer(playerId: string, tournamentId: string): Promise<void>;

    /**
     * Withdraws an already registered player from a tournament
     * @param playerId The id of the player to withdraw
     * @param tournamentId The id of the tournament where the player is registered and wants to be withdrawn from
     */
    withdrawPlayer(playerId: string, tournamentId: string): Promise<void>;

    // Private tournament service api
    /**
     * Closes the open insciptions from a tournament and creates all the matches associated with it
     * @param tournamentId The id of the tournament to initialize
     */
    initializeTournament(tournamentId: string): Promise<void>

    /**
     * Changes the status of a match from 'pending' to 'ongoing', indicating that is being played
     * @param tournamentId The id of the tournament the match is in
     * @param indexId The number of round and number of match in that round that is being started
     */
    startMatch(tournamentId: string, indexId: IndexId): Promise<void>

    /**
     * Reports the result of a match, automatically advancing the tournament
     * @param tournamentId The id of the tournament where the match is in
     * @param indexId The number of round and number of match in that round that is being reported
     * @param reportObject The result of the match
     */
    reportMatch(tournamentId: string, indexId: IndexId, reportObject: Object): Promise<void>
}