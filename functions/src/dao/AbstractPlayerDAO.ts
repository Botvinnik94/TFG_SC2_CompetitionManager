import { IPlayer } from "../model/IPlayer";

export abstract class AbstractPlayerDAO<TPlayer extends IPlayer> {

    abstract findOne(id: string): Promise<TPlayer>;

}