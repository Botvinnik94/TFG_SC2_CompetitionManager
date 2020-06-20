import { AbstractTournamentDAO } from "../dao/AbstractTournamentDAO";
import { AbstractMatchDAO } from "../dao/AbstractMatchDAO";
import { ITournament } from "../model/ITournament";
import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";
import { IndexId } from "../model/IndexId";
import { AbstractPlayerDAO } from "../dao/AbstractPlayerDAO";

const key = new Object()
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

export class TournamentService< TPlayer extends IPlayer, 
                                TMatch extends IMatch<TPlayer>, 
                                TRanking extends IRanking<TPlayer>, 
                                TRound extends IRound<TPlayer, TMatch>> {

    private tournamentDAO: AbstractTournamentDAO<TPlayer, TMatch, TRanking, TRound>
    private matchDAO: AbstractMatchDAO<TPlayer, TMatch>
    private playerDAO: AbstractPlayerDAO<TPlayer>
    private tournament: ITournament<TPlayer, TMatch, TRanking, TRound>

    constructor(tournamentDAO: AbstractTournamentDAO<TPlayer, TMatch, TRanking, TRound>,
                matchDAO: AbstractMatchDAO<TPlayer, TMatch>,
                botDAO: AbstractPlayerDAO<TPlayer>,
                tournament: ITournament<TPlayer, TMatch, TRanking, TRound>)
    {
        this.tournamentDAO = tournamentDAO;
        this.matchDAO = matchDAO;
        this.playerDAO = botDAO;
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
        const matchesPromises: Promise<string>[] = [];
        for (let i = 0; i < this.tournament.rounds.length; i++) {
            for (let j = 0; j < this.tournament.rounds[i].matches.length; j++) {
                matchesPromises.push(this.matchDAO.create(this.tournament.rounds[i].matches[j]));
            }
        }
        await Promise.all(matchesPromises);
        await this.tournamentDAO.update(this.tournament);
    }

    public async startMatch(indexId: IndexId) {
        const match = this.tournament.rounds[indexId.roundIndex].matches[indexId.matchIndex];
        match.start();
        await this.matchDAO.update(match);
        await this.tournamentDAO.update(this.tournament);
    }

    /**
     * Because report match often increments values in the ranking categories
     * we must ensure that a critical section is mantained.
     * 
     * There should be a transaction in place. However, the design choices made
     * early in the devevolpment hindered its implementation.
     * 
     * ATTENTION: the critical section means that this system IS NOT SCALABLE in
     * multiple instances. THERE MUST BE ONE AND ONLY ONE INSTANCE OF THIS SYSTEM
     * RUNNING, else there is a risk for race conditions and incosistencies.
     */
    public async reportMatch(indexId: IndexId, reportObject: Object, ranked?: boolean) {
        await lock.acquire(key, async () => {
            this.tournament.scoreMatch(indexId, reportObject, ranked);
            const match = this.tournament.rounds[indexId.roundIndex].matches[indexId.matchIndex];
            // Update match in DB
            await this.matchDAO.update(match);

            // Update players information (elo changes & tournament wins) in DB
            if(this.tournament.status === 'finished') {
                const winner = await this.playerDAO.findOne(this.tournament.rankings[0].player.id)
                winner.tournamentWins.push(this.tournament.id || '')
                await this.playerDAO.update(winner)
            }

            // const playerPromisesArray: Promise<void>[] = []
            // this.tournament.rankings.forEach(ranking => {
            //     playerPromisesArray.push(this.playerDAO.update(ranking.player))
            // })
            // await Promise.all(playerPromisesArray)

            // Update tournament in DB
            await this.tournamentDAO.update(this.tournament);
        })
    }

}