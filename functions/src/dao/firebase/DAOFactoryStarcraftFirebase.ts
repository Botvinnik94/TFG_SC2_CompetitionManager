import { IDAOFactory } from "../IDAOFactory";
import { FirebaseStarcraftTournamentDAO } from './FirebaseStarcraftTournamentDAO'
import { FirebaseStarcraftMatchDAO } from './FirebaseStarcraftMatchDAO'
import { StarcraftMatch } from "../../model/StarcraftTournamentElements/StarcraftMatch";
import { StarcraftRanking } from "../../model/StarcraftTournamentElements/StarcraftRanking";
import { StarcraftRound } from "../../model/StarcraftTournamentElements/StarcraftRound";
import { Bot } from "../../model/StarcraftTournamentElements/Bot";

export class DAOFactoryStarcraftFirebase implements IDAOFactory<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> {

    createTournamentDAO(): FirebaseStarcraftTournamentDAO {
        return new FirebaseStarcraftTournamentDAO();
    }

    createMatchDAO(): FirebaseStarcraftMatchDAO {
        return new FirebaseStarcraftMatchDAO();
    }

}