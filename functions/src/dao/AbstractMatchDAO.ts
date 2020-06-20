import { IMatch } from "../model/IMatch";
import { IPlayer } from "../model/IPlayer";
import { IMatchFilter } from "../model/IMatchFilter";

export abstract class AbstractMatchDAO<TPlayer extends IPlayer, TMatch extends IMatch<TPlayer>> {

    abstract findOne(id: string): Promise<TMatch>;
    abstract find(matchFilter: IMatchFilter, limit?: number): Promise<TMatch[]>;
    abstract create(match: TMatch): Promise<string>;
    abstract update(match: TMatch): Promise<void>;
    abstract delete(id: string): Promise<void>;

}