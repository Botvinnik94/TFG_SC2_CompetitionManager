import { AbstractCompetitionDAO } from "./AbstractCompetitionDAO";
import { AbstractMatchDAO } from "./AbstractMatchDAO";

export interface IDAOFactory {

    getCompetitionDAO(): AbstractCompetitionDAO
    getMatchDAO(): AbstractMatchDAO

}