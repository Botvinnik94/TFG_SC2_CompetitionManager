import { IMatch } from "../model/IMatch";
import { IPlayer } from "../model/IPlayer";

export abstract class AbstractMatchDAO<TPlayer extends IPlayer, TMatch extends IMatch<TPlayer>> {

    abstract create(match: TMatch): Promise<string>;
    abstract update(match: TMatch): Promise<void>;
    abstract delete(id: string): Promise<void>;

}