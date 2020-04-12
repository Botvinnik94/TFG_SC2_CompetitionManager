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
            round.onRoundStarted.subscribe( () => {
                this.onRoundStartedHandler();
            });
            round.onRoundFinished.subscribe( () => {
                this.onRoundFinishedHandler();
            })
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

            // If the amount of players is not even we add a dummy one for the algorithm, but we dont create matches with him
            if(this.players.length % 2 !== 0) {
                rotablePlayersArray.push({
                    name: 'bye',
                    elo: 0,
                    id: 'undefined'
                });
            }

            for (let i = 0; i < this.players.length; i++) {
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

                // Create ranking for the player
                this.rankings.push(this.tournamentElementsFactory.createTournamentRanking(this.players[i]));
            }

            this.status = "pending";
        }
        else {
            throw new Error("Tournament already initializated");
        }
    }

    public scoreMatch(indexId: IndexId, resultObject: Object): void {
        this.rounds[indexId.roundIndex].matches[indexId.matchIndex].score(resultObject);
    }

    private addRound(round: TRound): void {
        round.onRoundStarted.subscribe(() => {
            this.onRoundStartedHandler();
        });
        round.onRoundFinished.subscribe(() => {
            this.onRoundFinishedHandler();
        });
        this.rounds.push(round);
    }

}