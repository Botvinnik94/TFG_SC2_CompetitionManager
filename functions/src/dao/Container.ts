import { PersistenceType } from "./PersistenceType";
import { IDAOFactory } from "./IDAOFactory";
import { DAOFactoryFirebase } from "./firebase/DAOFactoryFirebase";

export class Container {

    public static getDAOFactory(type: PersistenceType): IDAOFactory {
        switch (type) {
            case PersistenceType.Firebase:
                return new DAOFactoryFirebase()
        
            default:
                throw new Error("Invalid persistence type");
        }
    }

}