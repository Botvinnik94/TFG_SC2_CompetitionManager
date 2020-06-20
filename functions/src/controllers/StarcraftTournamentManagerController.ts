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
import { IndexId } from "../model/IndexId";
import { IMatchFilter } from "../model/IMatchFilter";
import { ITournamentFilter } from "../model/ITournamentFilter";

export class StarcraftTournamentManagerController implements ITournamentManagerController<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>{

    async deleteTournament(tournamentId: string): Promise<void> {
        const tournamentDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createTournamentDAO();
        await tournamentDAO.delete(tournamentId);
    }

    async createTournament(type: "round-robin", name: string, startingDate: number): Promise<string> {
        const tournamentSelector = new TournamentTypeSelector<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>();
        const tournamentFactory = tournamentSelector.getTournamentFactory(type);
        const tournamentDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createTournamentDAO();
        const tournament = tournamentFactory.createTournament(name, startingDate, new StarcraftTournamentElementsFactory());
        return await tournamentDAO.create(tournament);
    }

    async getTournament(tournamentId: string): Promise<ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>> {
        const tournamentDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createTournamentDAO();
        return await tournamentDAO.findOne(tournamentId);
    }

    async getTournaments(tournamentFilter: ITournamentFilter, limit?: number): Promise<ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>[]> {
        const tournamentDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createTournamentDAO();
        return await tournamentDAO.find(tournamentFilter, limit);
    }

    async getMatch(matchId: string): Promise<StarcraftMatch> {
        const matchDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createMatchDAO();
        return await matchDAO.findOne(matchId);
    }

    async getMatches(matchFilter: IMatchFilter, limit?: number): Promise<StarcraftMatch[]> {
        const matchDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createMatchDAO();
        return await matchDAO.find(matchFilter, limit);
    }

    async enrollPlayer(playerId: string, tournamentId: string): Promise<void> {
        const tournamentService = await this.buildTournamentService(tournamentId);
        const botDAO = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase).createPlayerDAO();
        await tournamentService.enrollPlayer(await botDAO.findOne(playerId));
    }

    async withdrawPlayer(playerId: string, tournamentId: string): Promise<void> {
        const tournamentService = await this.buildTournamentService(tournamentId);
        await tournamentService.withdrawPlayer(playerId);
    }

    public async initializeTournament(tournamentId: string): Promise<void> {
        const tournamentService = await this.buildTournamentService(tournamentId);
        await tournamentService.initializateTournament();
    }

    public async startMatch(tournamentId: string, indexId: IndexId): Promise<void> {
        const tournamentService = await this.buildTournamentService(tournamentId);
        await tournamentService.startMatch(indexId);
    }

    public async reportMatch(tournamentId: string, indexId: IndexId, reportObject: { winner: 0 | 1 | "draw", map: string, replayURL: string}) {
        const tournamentService = await this.buildTournamentService(tournamentId);
        await tournamentService.reportMatch(indexId, reportObject);
    }


    // Helpers

    private async buildTournamentService(tournament: ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> | string) {
        const tournamentServiceFactory = new TournamentServiceFactory<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>();
        const daoFactory = (new StarcraftContainer()).getDAOFactory(PersistenceType.Firebase);
        const tournamentDAO = daoFactory.createTournamentDAO();
        const matchDAO = daoFactory.createMatchDAO();
        const playerDAO = daoFactory.createPlayerDAO();
        return await tournamentServiceFactory.createTournamentService(tournamentDAO, matchDAO, playerDAO, tournament);
    }

}