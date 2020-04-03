import { AbstractCompetitionDAO } from "../dao/AbstractCompetitionDAO";
import { TournamentFactory } from "./TournamentFactory";

export class CompetitionInitializer {

    competitionDAO: AbstractCompetitionDAO;

    constructor(competitionDAO: AbstractCompetitionDAO) {
        this.competitionDAO = competitionDAO;
    }

    public async initialize(competitionId: string) {
        const competition = await this.competitionDAO.findOne(competitionId);
        const tournament = TournamentFactory.getTournament(competition);
        console.log(tournament.matches)
    }

}