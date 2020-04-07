import { AbstractTournamentDAO } from "./AbstractTournamentDAO";
import { AbstractMatchDAO } from "./AbstractMatchDAO";

export interface IDAOFactory {

    getTournamentDAO(): AbstractTournamentDAO
    getMatchDAO(): AbstractMatchDAO

}