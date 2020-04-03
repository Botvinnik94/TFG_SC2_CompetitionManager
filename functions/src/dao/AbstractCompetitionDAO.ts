import { Competition } from '../model/Competition'

export abstract class AbstractCompetitionDAO {

    abstract findOne(id: string): Promise<Competition>;
    abstract update(competition: Competition): Promise<void>;
    abstract delete(id: string): Promise<void>;

}