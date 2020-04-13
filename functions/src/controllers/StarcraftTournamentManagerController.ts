import { StarcraftMatch } from "../model/StarcraftTournamentElements/StarcraftMatch";
import { StarcraftRanking } from "../model/StarcraftTournamentElements/StarcraftRanking";
import { StarcraftRound } from "../model/StarcraftTournamentElements/StarcraftRound";
import { Bot } from "../model/StarcraftTournamentElements/Bot";
import { TournamentServiceFactory } from "../services/TournamentServiceFactory";
import { StarcraftContainer } from "../dao/StarcraftContainer";
import { PersistenceType } from "../dao/PersistenceType";
import { ITournamentManagerController } from "./ITournamentManagerController";
import { ITournament } from "../model/ITournament";
import { TournamentTypeSelector } from "../model/TournamentTypeSelector";
import { StarcraftTournamentElementsFactory } from "../model/StarcraftTournamentElements/StarcraftTournamentElementsFactory";

export class StarcraftTournamentManagerController implements ITournamentManagerController<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>{

    async deleteTournament(tournamentId: string): Promise<void> {
        const tournamentDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createTournamentDAO();
        await tournamentDAO.delete(tournamentId);
    }

    async createTournament(type: "round-robin", name: string, startingDate: number): Promise<void> {
        const tournamentSelector = new TournamentTypeSelector<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>();
        const tournamentFactory = tournamentSelector.getTournamentFactory(type);
        const tournamentDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createTournamentDAO();
        const tournament = tournamentFactory.createTournament(name, startingDate, new StarcraftTournamentElementsFactory());
        await tournamentDAO.create(tournament);
    }

    async getTournament(tournamentId: string): Promise<ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>> {
        const tournamentDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createTournamentDAO();
        return await tournamentDAO.findOne(tournamentId);
    }

    async enrollPlayer(playerId: string, tournamentId: string): Promise<void> {
        const tournamentService = await this.buildTournamentService(tournamentId);
        const botDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createPlayerDAO();
        return await tournamentService.enrollPlayer(await botDAO.findOne(playerId));
    }

    async withdrawPlayer(playerId: string, tournamentId: string): Promise<void> {
        const tournamentService = await this.buildTournamentService(tournamentId);
        return await tournamentService.withdrawPlayer(playerId);
    }

    public async initializeTournament(tournamentId: string): Promise<void> {
        const tournamentService = await this.buildTournamentService(tournamentId);
        await tournamentService.initializateTournament();
    }

    private async buildTournamentService(tournament: ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> | string) {
        const tournamentServiceFactory = new TournamentServiceFactory<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>();
        const daoFactory = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase);
        const tournamentDAO = daoFactory.createTournamentDAO();
        const matchDAO = daoFactory.createMatchDAO();
        return await tournamentServiceFactory.createTournamentService(tournamentDAO, matchDAO, tournament);
    }

}