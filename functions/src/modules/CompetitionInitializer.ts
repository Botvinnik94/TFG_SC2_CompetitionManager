import { AbstractCompetitionDAO } from "../dao/AbstractCompetitionDAO";
import { TournamentFactory } from "./TournamentFactory";
import { AbstractMatchDAO } from "../dao/AbstractMatchDAO";
import { Match } from "../model/Match";
import { IRound } from "../model/IRound";

export class CompetitionInitializer {

    competitionDAO: AbstractCompetitionDAO;
    matchDAO: AbstractMatchDAO

    constructor(competitionDAO: AbstractCompetitionDAO, matchDAO: AbstractMatchDAO) {
        this.competitionDAO = competitionDAO;
        this.matchDAO = matchDAO;
    }

    public async initialize(competitionId: string) {
        const competition = await this.competitionDAO.findOne(competitionId);
        const tournament = TournamentFactory.getTournament(competition);
        competition.participants.sort((a, b) => b.elo - a.elo);

        var round: IRound = {
            matches: [],
            status: "pending",
            startedAt: null,
            finishedAt: null
        };
        var roundNumber = 0;

        for (let index = 0; index < tournament.matches.length; index++) {
            const rawMatch = tournament.matches[index];
            const participant1 = competition.participants[rawMatch.p[0] - 1];
            const participant2 = competition.participants[rawMatch.p[1] - 1];

            const matchId = await this.matchDAO.create(new Match(participant1, participant2, [], "pending", "0-0", null, null, null));
            if(roundNumber != rawMatch.id.r - 1) {
                competition.rounds.push(round);
                round = {
                    matches: [],
                    status: "pending",
                    startedAt: null,
                    finishedAt: null
                };
                roundNumber++;
            }
            round.matches.push(matchId);
        }

        competition.rounds.push(round);
        competition.status = "pending";
        await this.competitionDAO.update(competition);

        //TODO: error check w/ rollback
    }

}