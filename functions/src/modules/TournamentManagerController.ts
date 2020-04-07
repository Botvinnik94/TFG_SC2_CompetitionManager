import { AbstractTournamentDAO } from "../dao/AbstractTournamentDAO";

export class TournamentManagerController {

    tournamentDAO: AbstractTournamentDAO;

    constructor(tournamentDAO: AbstractTournamentDAO) {
        this.tournamentDAO = tournamentDAO;
    }

    public async initializeTournament(tournamentId: string): Promise<void> {
        const tournament = await this.tournamentDAO.findOne(tournamentId);
        tournament.initializeTournament();
        return await this.tournamentDAO.update(tournament);
    }

}