import { IDAOFactory } from "../IDAOFactory";
import { FirebaseStarcraftTournamentDAO } from './FirebaseStarcraftTournamentDAO'
import { FirebaseStarcraftMatchDAO } from './FirebaseStarcraftMatchDAO'
import { StarcraftMatch } from "../../model/StarcraftTournamentElements/StarcraftMatch";
import { StarcraftRanking } from "../../model/StarcraftTournamentElements/StarcraftRanking";
import { StarcraftRound } from "../../model/StarcraftTournamentElements/StarcraftRound";
import { Bot } from "../../model/StarcraftTournamentElements/Bot";
import { FirebaseBotDAO } from "./FirebaseBotDAO";

export class DAOFactoryStarcraftFirebase implements IDAOFactory<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> {

    /**
     * Returns a Data Access Object that uses a Firebase provider for Starcraft players
     */
    createPlayerDAO(): FirebaseBotDAO {
        return new FirebaseBotDAO();
    }

    /**
     * Returns a Data Access Object that uses a Firebase provider for Starcraft tournaments
     */
    createTournamentDAO(): FirebaseStarcraftTournamentDAO {
        return new FirebaseStarcraftTournamentDAO();
    }

    /**
     * Returns a Data Access Object that uses a Firebase provider for Starcraft matches
     */
    createMatchDAO(): FirebaseStarcraftMatchDAO {
        return new FirebaseStarcraftMatchDAO();
    }

}