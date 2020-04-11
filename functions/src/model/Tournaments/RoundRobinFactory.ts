import { ITournamentFactory } from "../ITournamentFactory";
import { RoundRobin } from "./RoundRobin";

export class RoundRobinFactory implements ITournamentFactory {

    createTournament(name: string): RoundRobin {
        return new RoundRobin(name, [], [], [], "open", null, null);
    }

}