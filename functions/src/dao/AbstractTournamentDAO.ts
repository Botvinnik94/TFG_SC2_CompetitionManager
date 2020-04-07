import { ITournament } from "../model/ITournament";

export abstract class AbstractTournamentDAO {

    abstract findOne(id: string): Promise<ITournament>;
    abstract update(tournament: ITournament): Promise<void>;
    abstract delete(id: string): Promise<void>;

}