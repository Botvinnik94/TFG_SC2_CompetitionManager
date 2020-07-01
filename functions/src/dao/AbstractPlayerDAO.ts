import { IPlayer } from "../model/IPlayer";

export abstract class AbstractPlayerDAO<TPlayer extends IPlayer> {

    /**
     * Returns a player from the database given its id
     * @param id 
     */
    abstract findOne(id: string): Promise<TPlayer>;

    /**
     * Updates an existing player in the database
     * @param player The player to update
     */
    abstract update(player: TPlayer): Promise<void>;

}