import { IMatch } from "../IMatch";
import { IStarcraftGame } from "./IStarcraftGame";
import { IndexId } from "../IndexId";
import { SubEvent } from 'sub-events';
import { Bot } from "./Bot";

export class StarcraftMatch implements IMatch<Bot> {

    id: string | undefined;
    tournamentId: string | undefined;
    indexId: IndexId;
    players: Bot[];
    result: number[];
    bestOf: number;
    games: IStarcraftGame[];
    status: "waiting" | "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    readonly onMatchReady: SubEvent<void> = new SubEvent();
    readonly onMatchStarted: SubEvent<void> = new SubEvent();
    readonly onMatchFinished: SubEvent<{winner: number, elos: number[]}> = new SubEvent();
    readonly onMatchScore: SubEvent<number> = new SubEvent();

    constructor(indexId: IndexId,
                players: Bot[], 
                result: number[], 
                bestOf: number, 
                games: IStarcraftGame[], 
                status: "waiting" | "pending" | "ongoing" | "finished", 
                startedAt: number | null, 
                finishedAt: number | null,
                tournamentId?: string,
                id?: string)
    {
        this.players = players;
        this.result = result;
        this.bestOf = bestOf;
        this.games = games;
        this.status = status;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.id = id;
        this.tournamentId = tournamentId;
        this.indexId = indexId;
    }

    addPlayer(player: Bot): void {
        if(this.players.length < 2) {
            this.players.push(player);
            if(this.players.length == 2) {
                this.status = "pending";
                this.onMatchReady.emit();
            }
        }
        else {
            throw new Error(`Match (${this.indexId.roundIndex},${this.indexId.matchIndex}) is full of players`);
        }
    }

    start(): void {
        if(this.status === "pending") {
            this.status = "ongoing"
            this.startedAt = Date.now();
            this.onMatchStarted.emit();
        }
        else {
            throw new Error(`Match (${this.indexId.roundIndex},${this.indexId.matchIndex}) has already started`);
        }
    }

    score(reportObject: { winner: 0 | 1 | "draw", map: string, replayURL: string}, ranked?: boolean): void {

        const game: IStarcraftGame = {
            participant1: this.players[0],
            participant2: this.players[1],
            winner: reportObject.winner,
            map: reportObject.map,
            replayURL: reportObject.replayURL
        };

        if(this.status === "ongoing") {
            this.games.push(game);
            if(game.winner !== 'draw') {
                this.onMatchScore.emit(game.winner);

                if(++this.result[game.winner] === (Math.floor(this.bestOf / 2) + 1)) {
                    this.status = "finished";
                    this.finishedAt = Date.now();

                    let elo1 = game.participant1.elo
                    let elo2 = game.participant2.elo

                    if(ranked) {
                        const EloRank = require("elo-rank").default;
                        const elorank = new EloRank();
                        const expectedParticipant1 = elorank.getExpected(game.participant1.elo, game.participant2.elo);
                        const expectedParticipant2 = elorank.getExpected(game.participant2.elo, game.participant1.elo);

                        elo1 = elorank.updateRating(expectedParticipant1, (game.winner == 0) ? 1 : 0, game.participant1.elo);
                        elo2 = elorank.updateRating(expectedParticipant2, (game.winner == 1) ? 1 : 0, game.participant2.elo);
                    }

                    this.onMatchFinished.emit({winner: game.winner, elos: [elo1, elo2]});
                }
            }
        }
        else {
            throw new Error(`Match (${this.indexId.roundIndex},${this.indexId.matchIndex}) is not ongoing`);
        }

    }

}