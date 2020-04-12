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

    public abstract getDAOFactory(type: PersistenceType): IDAOFactory<TPlayer, TMatch, TRanking, TRound>;

}