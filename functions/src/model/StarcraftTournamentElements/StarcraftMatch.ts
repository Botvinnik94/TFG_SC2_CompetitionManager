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
    readonly onMatchFinished: SubEvent<void> = new SubEvent();

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
            throw new Error(`Match ${this.indexId} is full of players`);
        }
    }

    start(): void {
        if(this.status === "pending") {
            this.status = "ongoing"
            this.startedAt = Date.now();
            this.onMatchStarted.emit();
        }
        else {
            throw new Error(`Match ${this.indexId} has already started`);
        }
    }

    score(game: IStarcraftGame): void {

        if(game.participant1.id === this.players[0].id && game.participant2.id === this.players[1].id && this.status === "ongoing") {
            this.games.push(game);
            if(game.winner !== 'draw' && ++this.result[game.winner] === (Math.floor(this.bestOf / 2) + 1)) {
                this.status = "finished";
                this.finishedAt = Date.now();
                this.onMatchFinished.emit();
            }
        }
        else {
            throw new Error(`Match ${this.indexId} is not ongoing or the game does not correspond with the match`);
        }

    }

}