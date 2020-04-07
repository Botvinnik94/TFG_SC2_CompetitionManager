import { IDAOFactory } from "../IDAOFactory";
import { FirebaseCompetitionDAO } from './FirebaseCompetitionDAO'
import { FirebaseMatchDAO } from './FirebaseMatchDAO'

export class DAOFactoryFirebase implements IDAOFactory {

    getTournamentDAO(): FirebaseCompetitionDAO {
        return new FirebaseCompetitionDAO();
    }

    getMatchDAO(): FirebaseMatchDAO {
        return new FirebaseMatchDAO();
    }

}