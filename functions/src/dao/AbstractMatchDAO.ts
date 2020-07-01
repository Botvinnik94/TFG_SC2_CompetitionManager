import { IMatch } from "../model/IMatch";
import { IPlayer } from "../model/IPlayer";
import { IMatchFilter } from "../model/IMatchFilter";

export abstract class AbstractMatchDAO<TPlayer extends IPlayer, TMatch extends IMatch<TPlayer>> {

    /**
     * Returns a match from the database given its id
     * @param id 
     */
    abstract findOne(id: string): Promise<TMatch>;

    /**
     * Returns a list of matches from the database that meet certain criteria
     * @param matchFilter The match filtering criteria
     * @param limit Limits the amount of results returned from the database
     */
    abstract find(matchFilter: IMatchFilter, limit?: number): Promise<TMatch[]>;

    /**
     * Adds a new match to the database
     * @param match Match to add
     */
    abstract create(match: TMatch): Promise<string>;

    /**
     * Updates an existing match in the database
     * @param match Match to update
     */
    abstract update(match: TMatch): Promise<void>;

    /**
     * Deletes an existing match from the database
     * @param id The id of the match to delete
     */
    abstract delete(id: string): Promise<void>;

}