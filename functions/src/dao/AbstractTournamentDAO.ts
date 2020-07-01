import { ITournament } from "../model/ITournament";
import { ITournamentFilter } from "../model/ITournamentFilter";
import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";

export abstract class AbstractTournamentDAO<TPlayer extends IPlayer, 
                                            TMatch extends IMatch<TPlayer>, 
                                            TRanking extends IRanking<TPlayer>, 
                                            TRound extends IRound<TPlayer, TMatch>>
{
    /**
     * Returns a tournament from the database given its id
     * @param id 
     */
    abstract findOne(id: string): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>>;

    /**
     * Returns a list of tournaments from the database that meet certain criteria
     * @param tournamentFilter The tournament filtering criteria
     * @param limit Limits the amount of results returned
     */
    abstract find(tournamentFilter: ITournamentFilter, limit?: number): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>[]>

    /**
     * Adds a new tournament in the dabase
     * @param tournament The tournament to add
     */
    abstract create(tournament: ITournament<TPlayer, TMatch, TRanking, TRound>): Promise<string>;

    /**
     * Updates an existing tournament in the database
     * @param tournament The tournament to update
     */
    abstract update(tournament: ITournament<TPlayer, TMatch, TRanking, TRound>): Promise<void>;

    /**
     * Deletes an existing tournament from the database
     * @param id The id of the tournament to delete
     */
    abstract delete(id: string): Promise<void>;

    /**
     * Registers a player in a tournament saving the change in the database
     * @param player The player object to register
     * @param tournamentId The id of the tournament the player is registering into
     */
    abstract enrollPlayer(player: IPlayer, tournamentId: string): Promise<void>;

    /**
     * Withdraws a registered player from the tournament, saving the change in the database
     * @param playerId The id of the player to withdraw
     * @param tournamentId The id of the tournament where the player is registered and wants to be removed from
     */
    abstract withdrawPlayer(playerId: string, tournamentId: string): Promise<void>;
}