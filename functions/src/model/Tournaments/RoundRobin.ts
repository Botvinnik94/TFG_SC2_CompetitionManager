import { ITournament } from "../ITournament";
import { IMatch } from "../IMatch";
import { IRanking } from "../IRanking";
import { IRound } from '../IRound';
import { IPlayer } from '../IPlayer';
import { ITournamentElementsFactory } from "../ITournamentElementsFactory";
import { IndexId } from "../IndexId";

export class RoundRobin<TPlayer extends IPlayer,
                        TMatch extends IMatch<TPlayer>,
                        TRanking extends IRanking<TPlayer>,
                        TRound extends IRound<TPlayer, TMatch>>

implements ITournament<TPlayer, TMatch, TRanking, TRound>
{

    id: string | undefined;
    name: string;
    rounds: TRound[];
    rankings: TRanking[];
    players: TPlayer[];
    status: "open" | "pending" | "ongoing" | "finished";
    startingDate: number;
    startedAt: number | null;
    finishedAt: number | null;

    readonly type: "round-robin";
    tournamentElementsFactory: ITournamentElementsFactory<TPlayer, TMatch, TRanking, TRound>;

    constructor(name: string, 
                rounds: TRound[], 
                rankings: TRanking[], 
                players: TPlayer[], 
                status: "open" | "pending" | "ongoing" | "finished",
                startingDate: number,
                startedAt: number | null, 
                finishedAt: number | null,
                tournamentElementsFactory: ITournamentElementsFactory<TPlayer, TMatch, TRanking, TRound>,
                id?: string)
    {
        this.name = name;
        this.rounds = rounds;
        this.rankings = rankings;
        this.players = players;
        this.status = status;
        this.startingDate = startingDate;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.tournamentElementsFactory = tournamentElementsFactory;
        this.type = "round-robin";
        this.id = id;

        this.rounds.forEach(round => {
            this.subscribeToRoundEvents(round);
        })
    }

    onRoundStartedHandler(): void {
        if(this.status === "pending") {
            this.status = "ongoing";
            this.startedAt = Date.now();
        }
    }

    onRoundFinishedHandler(): void {
        const roundNotFinished = this.rounds.find( value => value.status !== "finished");
        if(!roundNotFinished) {
            this.status = "finished";
            this.finishedAt = Date.now();
        }
    }

    public enrollPlayer(player: TPlayer): void {
        const result = this.players.find( value => value.id === player.id );
        if(!result) {
            this.players.push(player);
        }
        else {
            throw new Error(`Player ${player.id} already enrolled in the tournament`);
        }
    }

    public withdrawPlayer(playerId: string): void {
        const index = this.players.findIndex( value => value.id === playerId )
        if(index != -1) {
            this.players.splice(index, 1);
        }
        else {
            throw new Error(`Player ${playerId} is not enrolled in the tournament`)
        }
    }

    public findMatches(status?: "pending" | "ongoing" | "finished" | "waiting", playerId?: string, roundNumber?: number): TMatch[] {
        let matches: TMatch[] = []; 

        if(roundNumber != null) {
            if(this.rounds[roundNumber] != undefined) matches = this.rounds[roundNumber].matches;
        }
        else{
            matches = Array.prototype.concat.apply([], this.rounds.map( round => round.matches)); // Flatten
        }

        if(status) {
            matches = matches.filter( match => match.status === status);
        }

        if(playerId) {
            matches = matches.filter( match => match.players.find( player => player.id === playerId));
        }

        return matches;
    }

    public results(playerId: string): TRanking | undefined {
        return this.rankings.find( value => value.player.id === playerId );
    }

    public initializeTournament(): void {

        if(this.status === "open") {
            const rotablePlayersArray: IPlayer[] = this.players.slice(1);
            var rounds = this.players.length - 1;

            // If the amount of players is not even we add a dummy one for the algorithm, but we dont create matches with him
            if(this.players.length % 2 !== 0) {
                rounds++;
                rotablePlayersArray.push({
                    name: 'bye',
                    elo: 0,
                    id: 'undefined',
                    tournamentWins: []
                });
            }

            for (let i = 0; i < rounds; i++) {
                const round = this.tournamentElementsFactory.createTournamentRound();
                for (let j = 0; j < Math.floor(rotablePlayersArray.length / 2); j++) {
                    if(rotablePlayersArray[j].name != 'bye' && rotablePlayersArray[rotablePlayersArray.length-2-j].name != 'bye') {
                        const match = this.tournamentElementsFactory.createTournamentMatch({ roundIndex: i, matchIndex: round.matches.length }, this.id);
                        match.addPlayer(rotablePlayersArray[j] as TPlayer);
                        match.addPlayer(rotablePlayersArray[rotablePlayersArray.length-2-j] as TPlayer);
                        round.addMatch(match);
                    }
                }

                if(rotablePlayersArray[rotablePlayersArray.length - 1].name != 'bye') {
                    const match = this.tournamentElementsFactory.createTournamentMatch({ roundIndex: i, matchIndex: round.matches.length }, this.id);
                    match.addPlayer(this.players[0]);
                    match.addPlayer(rotablePlayersArray[rotablePlayersArray.length - 1] as TPlayer);
                    round.addMatch(match);
                }

                this.addRound(round);

                // Rotate
                let p = rotablePlayersArray.shift();
                if(p) rotablePlayersArray.push(p);
            }

            this.players.forEach( player => {
                // Create ranking for the player
                this.rankings.push(this.tournamentElementsFactory.createTournamentRanking(player));
            })

            this.status = "pending";
        }
        else {
            throw new Error("Tournament already initializated");
        }
    }

    public scoreMatch(indexId: IndexId, resultObject: Object, ranked?: boolean): void {
        this.rounds[indexId.roundIndex].matches[indexId.matchIndex].score(resultObject, ranked);
    }

    private addRound(round: TRound): void {
        this.subscribeToRoundEvents(round);
        this.rounds.push(round);
    }

    private subscribeToRoundEvents(round: TRound) {
        round.onRoundStarted.subscribe(() => {
            this.onRoundStartedHandler();
        });
        round.onRoundFinished.subscribe(() => {
            this.onRoundFinishedHandler();
        });
        round.onMatchScore.subscribe( idPosition => {
            const match = round.matches[idPosition.matchIndex];
            const playerId = match.players[idPosition.position].id;

            // Update rankings (for & against)
            const winnerRanking = this.rankings.find( value => value.player.id === playerId);
            if(winnerRanking) winnerRanking.for++
            const losingPlayers = match.players.filter( value => value.id !== playerId);
            losingPlayers.forEach( losingPlayer => {
                const loserRanking = this.rankings.find( value => value.player.id === losingPlayer.id);
                if(loserRanking) loserRanking.against++;
            });
        });
        round.onMatchFinished.subscribe( idPosition => {
            const match = round.matches[idPosition.matchIndex];
            const playerId = match.players[idPosition.info.winner].id;

            // Update elos
            match.players.forEach( (player, index) => {
                const ranking = this.rankings.find( value => value.player.id === player.id)
                if(ranking) ranking.player.elo = idPosition.info.elos[index]
            })

            // Update rankings (win & loss)
            const winnerRanking = this.rankings.find( value => value.player.id === playerId);
            if(winnerRanking) winnerRanking.wins++
            const losingPlayers = match.players.filter( value => value.id !== playerId);
            losingPlayers.forEach( losingPlayer => {
                const loserRanking = this.rankings.find( value => value.player.id === losingPlayer.id);
                if(loserRanking) loserRanking.loses++;
            });

            // Sort rankings
            this.rankings.sort((a, b) => {
                if(a.wins === b.wins) {
                    if(b.for === a.for) {
                        return a.against - b.against
                    }
                    else {
                        return b.for - a.for
                    }
                }
                else {
                    return b.wins - a.wins
                }
            })
        })
    }

}