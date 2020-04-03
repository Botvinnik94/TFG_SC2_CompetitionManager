import { Match } from "../model/Match";

export abstract class AbstractMatchDAO {

    abstract create(match: Match): Promise<string>;
    abstract update(match: Match): Promise<void>;
    abstract delete(id: string): Promise<void>;

}