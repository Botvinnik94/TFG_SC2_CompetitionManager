import { Container } from "./Container";
import { Bot } from "../model/StarcraftTournamentElements/Bot";
import { StarcraftMatch } from "../model/StarcraftTournamentElements/StarcraftMatch";
import { StarcraftRanking } from "../model/StarcraftTournamentElements/StarcraftRanking";
import { StarcraftRound } from "../model/StarcraftTournamentElements/StarcraftRound";
import { PersistenceType } from "./PersistenceType";
import { DAOFactoryStarcraftFirebase } from "./firebase/DAOFactoryStarcraftFirebase";
import { IDAOFactory } from "./IDAOFactory";

export class StarcraftContainer extends Container<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> {

    public getDAOFactory(type: PersistenceType): IDAOFactory<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> {
        switch (type) {
            case PersistenceType.Firebase:
                return new DAOFactoryStarcraftFirebase();
        
            default:
                throw new Error("Invalid persistence type");
        }
    }
    
}