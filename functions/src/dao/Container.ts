import { PersistenceType } from "./PersistenceType";
import { IDAOFactory } from "./IDAOFactory";
import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";

export abstract class Container<TPlayer extends IPlayer, 
                                TMatch extends IMatch<TPlayer>, 
                                TRanking extends IRanking<TPlayer>, 
                                TRound extends IRound<TPlayer, TMatch>>
{

    /**
     * Returns an abstract Data Access Object Factory from an unknown game
     * @param type The database provider
     */
    public abstract getDAOFactory(type: PersistenceType): IDAOFactory<TPlayer, TMatch, TRanking, TRound>;

}