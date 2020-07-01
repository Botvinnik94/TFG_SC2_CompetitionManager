import { AbstractTournamentDAO } from "./AbstractTournamentDAO";
import { AbstractMatchDAO } from "./AbstractMatchDAO";
import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";
import { AbstractPlayerDAO } from "./AbstractPlayerDAO";

export interface IDAOFactory<TPlayer extends IPlayer, 
                             TMatch extends IMatch<TPlayer>, 
                             TRanking extends IRanking<TPlayer>, 
                             TRound extends IRound<TPlayer, TMatch>> {

    /**
     * Returns a Data Access Object of tournaments from an unknown game
     */
    createTournamentDAO(): AbstractTournamentDAO<TPlayer, TMatch, TRanking, TRound>

    /**
     * Returns a Data Access Object of matches from an unknown game
     */
    createMatchDAO(): AbstractMatchDAO<TPlayer, TMatch>

    /**
     * Return a Data Access Object of players from an unknown game
     */
    createPlayerDAO(): AbstractPlayerDAO<TPlayer>

}