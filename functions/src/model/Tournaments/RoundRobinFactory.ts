import { ITournamentFactory } from "../ITournamentFactory";
import { IMatch } from "../IMatch";
import { IRanking } from "../IRanking";
import { RoundRobin } from "./RoundRobin";

export class RoundRobinFactory<TMatch extends IMatch, TRanking extends IRanking> implements ITournamentFactory<TMatch , TRanking>{

    createTournament(name: string): RoundRobin<TMatch, TRanking> {
        return new RoundRobin(name, [], [], [], "open", null, null);
    }

}