import { AbstractTournamentDAO } from "../dao/AbstractTournamentDAO";
import { AbstractMatchDAO } from "../dao/AbstractMatchDAO";
import { ITournament } from "../model/ITournament";
import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";
import { IndexId } from "../model/IndexId";

export class TournamentService< TPlayer extends IPlayer, 
                                TMatch extends IMatch<TPlayer>, 
                                TRanking extends IRanking<TPlayer>, 
                                TRound extends IRound<TPlayer, TMatch>> {

    private tournamentDAO: AbstractTournamentDAO<TPlayer, TMatch, TRanking, TRound>
    private matchDAO: AbstractMatchDAO<TPlayer, TMatch>
    private tournament: ITournament<TPlayer, TMatch, TRanking, TRound>

    constructor(tournamentDAO: AbstractTournamentDAO<TPlayer, TMatch, TRanking, TRound>,
                matchDAO: AbstractMatchDAO<TPlayer, TMatch>,
                tournament: ITournament<TPlayer, TMatch, TRanking, TRound>)
    {
        this.tournamentDAO = tournamentDAO;
        this.matchDAO = matchDAO;
        this.tournament = tournament;
    }

    public async enrollPlayer(player: TPlayer): Promise<void> {
        this.tournament.enrollPlayer(player);
        await this.tournamentDAO.enrollPlayer(player, this.tournament.id ?? '');
    }

    public async withdrawPlayer(playerId: string): Promise<void> {
        this.tournament.withdrawPlayer(playerId);
        await this.tournamentDAO.withdrawPlayer(playerId, this.tournament.id ?? '')
    }

    public async initializateTournament() {
        this.tournament.initializeTournament();
        await this.tournamentDAO.update(this.tournament);
        this.tournament.rounds.forEach( round => {
            round.matches.forEach( async match => {
                await this.matchDAO.create(match);
            })
        });
    }

    public async startMatch(indexId: IndexId) {
        // this.tournament.rounds[indexId.roundIndex].matches[indexId.matchIndex].start();
        // await this.tournamentDAO.update(this.tournament);
        // await this.matchDAO.update();
    }

    public async reportMatch(indexId: IndexId, reportObject: Object) {
        // this.tournament.scoreMatch(indexId, reportObject);
        // await this.tournamentDAO.update(this.tournament);
        // await this.matchDAO.update();
    }

}