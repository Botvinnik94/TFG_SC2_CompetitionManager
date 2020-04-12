import { AbstractTournamentDAO } from "./AbstractTournamentDAO";
import { AbstractMatchDAO } from "./AbstractMatchDAO";
import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";

export interface IDAOFactory<TPlayer extends IPlayer, 
                             TMatch extends IMatch<TPlayer>, 
                             TRanking extends IRanking<TPlayer>, 
                             TRound extends IRound<TPlayer, TMatch>> {

    createTournamentDAO(): AbstractTournamentDAO<TPlayer, TMatch, TRanking, TRound>
    createMatchDAO(): AbstractMatchDAO<TPlayer, TMatch>

}