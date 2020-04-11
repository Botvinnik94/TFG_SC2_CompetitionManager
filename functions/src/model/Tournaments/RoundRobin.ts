import { ITournament } from "../ITournament";
import { IMatch } from "../IMatch";
import { IRanking } from "../IRanking";
import { IRound } from '../IRound';
import { IPlayer } from '../IPlayer';
import { IMatchFactory } from "../IMatchFactory";
import { IRankingFactory } from "../IRankingFactory";

/*import { Bot } from "./Bot";
import { Match } from "./Match";
import { IRound } from "../IRound";
import { IRanking } from "../IRanking";
import { IGame } from "../IGame";
import { ITournament } from "../ITournament";
import * as Tournament from 'tournament';
import * as GroupStage from 'groupstage'
import * as Duel from 'duel'
import { Round } from "./Round";

export class Competition implements ITournament {

    findRounds(state?: "pending" | "ongoing" | "finished" | undefined, round?: number | undefined): IRound[] {
        throw new Error("Method not implemented.");
    }

    scoreGame(numRound: number, numMatch: number, game: IGame): boolean {
        const match = this.rounds[numRound].matches[numMatch];
        match.reportGame(game);
        if(match.state == "finished") {
            const tournament = Tournament.restore(this.tournamentSerialized.numPlayers, this.tournamentSerialized.options, this.tournamentSerialized.state);
            tournament.score({s: 1, r: numRound+1, m: numMatch+1}, match.result)
        }
    }

    findMatches(state?:"pending" | "ongoing" | "finished", round?: number, match?: number | undefined): Match[] {
        var matches = [] as Match[];
        try {
            if(round) {
                if(match) {
                    matches = [this.rounds[round].matches[match]];
                }
                else {
                    matches = this.rounds[round].matches;
                }
            }
            else {
                this.rounds.forEach( round => {
                    round.matches.forEach( match => {
                        matches.push(match);
                    });
                });
            }

            if(state) {
                matches = matches.filter( match => {
                    return match.state === state;
                });
            }

            return matches;
        }
        catch(error) {
            return matches;
        }
    }

    findMatchesFor(playerId: string): Match[] {
        const matches = [] as Match[];
        this.rounds.forEach( round => {
            round.matches.forEach( match => {
                if(match.participant1?.id === playerId || match.participant2?.id === playerId)
                    matches.push(match);
            })
        })
        
        return matches;
    }

    results(playerId?: string | undefined): IRanking[] {
        if(playerId != null) {
            return this.rankings.filter(value => {
                return value.player.id === playerId
            });
        }
        else {
            return this.rankings;
        }
    }

    upcoming(playerId: string): Match[] {
        throw new Error("Method not implemented");
    }

    initializeTournament(): void {

        const tournament = this.getTournament(this.type, this.participants.length);
        this.participants.sort((a, b) => b.elo - a.elo);

        var round = new Round([], "pending", null, null);
        var roundNumber = 0;

        for (let index = 0; index < tournament.matches.length; index++) {
            const rawMatch = tournament.matches[index];

            const match = new Match(undefined, undefined, [], "pending", [0,0], 3, null, null, null)
            if(rawMatch.p[0] != 0) {
                match.addParticipant(this.participants[rawMatch.p[0] - 1])
            }
            if(rawMatch.p[1] != 0) {
                match.addParticipant(this.participants[rawMatch.p[1] - 1])
            }

            if(roundNumber != rawMatch.id.r - 1) {
                this.rounds.push(round);
                round = new Round([], "pending", null, null);
                roundNumber++;
            }
            round.addMatch(match);
        }

        this.rounds.push(round);
        this.status = "pending";
    }

    private getTournament(type: "round-robin" | "single-elimination" | "double-elimination", numParticipants: number) {

        switch (type) {
            case "round-robin":
                const roundRobin = new GroupStage(numParticipants)
                this.tournamentSerialized = { numPlayers: numParticipants, state: roundRobin.state.slice()}
                return roundRobin;
        
            case "single-elimination":
                const singleElimination = new Duel(numParticipants)
                this.tournamentSerialized = { numPlayers: numParticipants, state: singleElimination.state.slice()}
                return singleElimination;

            case "double-elimination":
                const doubleElimination = new Duel(numParticipants, { last: Duel.LB });
                this.tournamentSerialized = { numPlayers: numParticipants, options: { last: Duel.LB }, state: doubleElimination.state.slice()}
                return doubleElimination;
        }

    }

    id: string | undefined;
    participants: Bot[];
    name: string;
    type: "round-robin" | "single-elimination" | "double-elimination";
    rounds: Round[];
    rankings: IRanking[];
    status: "open" | "pending" | "ongoing" | "completed";
    startingDate: number;
    startedAt: number | null;
    finishedAt: number | null;

    tournamentSerialized: any;

    constructor(participants: Bot[],
                name: string,
                type: "round-robin" | "single-elimination" | "double-elimination",
                rounds: Round[],
                rankings: IRanking[],
                status: "open" | "pending" | "ongoing" | "completed",
                startingDate: number,
                startedAt: number | null,
                finishedAt: number | null,
                id?: string)
    {
        this.participants = participants;
        this.name = name;
        this.type = type;
        this.rounds = rounds;
        this.rankings = rankings;
        this.status = status;
        this.startingDate = startingDate;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.id = id;
    }

}*/
export class RoundRobin<TMatch extends IMatch, TRanking extends IRanking> implements ITournament<TMatch, TRanking> {

    id: string | undefined;
    name: string;
    rounds: IRound<TMatch>[];
    rankings: TRanking[];
    players: IPlayer[];
    status: "open" | "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    constructor(name: string, 
                rounds: IRound<TMatch>[], 
                rankings: TRanking[], 
                players: IPlayer[], 
                status: "open" | "pending" | "ongoing" | "finished", 
                startedAt: number | null, 
                finishedAt: number | null, 
                id?: string)
    {
        this.name = name;
        this.rounds = rounds;
        this.rankings = rankings;
        this.players = players;
        this.status = status;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.id = id;
    }


    public score(match: TMatch): boolean {
        throw new Error("Method not implemented.");
    }

    public findMatches(status?: "pending" | "ongoing" | "finished" | "waiting", playerId?: string, roundNumber?: number): TMatch[] {
        let matches: TMatch[]; 

        if(roundNumber != null) {
            matches = this.rounds[roundNumber].matches;
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

    public initializeTournament(matchFactory: IMatchFactory<TMatch>, rankingFactory: IRankingFactory<TRanking>): void {

        const rotablePlayersArray = this.players.slice(1);

        // If the amount of players is not even we add a dummy one for the algorithm, but we dont create matches with him
        if(this.players.length % 2 !== 0) {
            rotablePlayersArray.push({
                name: 'bye',
                elo: 0,
                id: undefined
            });
        }

        for (let i = 0; i < this.players.length; i++) {
            const round: IRound<TMatch> = {
                matches: [],
                status: "pending",
                startedAt: null,
                finishedAt: null
            }
            for (let j = 0; j < Math.floor(rotablePlayersArray.length / 2); j++) {
                if(rotablePlayersArray[j].id != null && rotablePlayersArray[rotablePlayersArray.length-2-j].id != null) {
                    const match = matchFactory.createMatch();
                    match.addPlayer(rotablePlayersArray[j]);
                    match.addPlayer(rotablePlayersArray[rotablePlayersArray.length-2-j]);
                    round.matches.push(match);
                }
            }

            if(rotablePlayersArray[rotablePlayersArray.length - 1].id != null) {
                const match = matchFactory.createMatch();
                match.addPlayer(this.players[0]);
                match.addPlayer(rotablePlayersArray[rotablePlayersArray.length - 1]);
                round.matches.push(match);
            }

            this.rounds.push(round);

            // Rotate
            let p = rotablePlayersArray.shift();
            if(p) rotablePlayersArray.push(p);

            // Create ranking for the player
            this.rankings.push(rankingFactory.createRanking(this.players[i]));
        }

        this.status = "pending";
    }


}