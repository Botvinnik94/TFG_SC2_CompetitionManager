import { IMatch } from "../IMatch";
import { IPlayer } from '../IPlayer';
import { IStarcraftGame } from "./IStarcraftGame";
import { IndexId } from "../IndexId";

/*import { Bot } from './Bot';
import { IGame } from '../IGame';
import { IMatch } from '../IMatch';
import { SubEvent } from 'sub-events';

export class Match implements IMatch {

    id: string | undefined;
    participant1: Bot | undefined;
    participant2: Bot | undefined;
    games: IGame[];
    state: "waiting" | "pending" | "ongoing" | "finished";
    result: number[];
    winsForEnd: number;
    winner: "1" | "2" | null;
    startedAt: number | null;
    finishedAt: number | null;

    readonly onMatchReady: SubEvent<IMatch> = new SubEvent();
    readonly onMatchStarted: SubEvent<IMatch> = new SubEvent();
    readonly onMatchFinished: SubEvent<IMatch> = new SubEvent();

    constructor(participant1: Bot | undefined,
                participant2: Bot | undefined,
                games: IGame[],
                state: "waiting" | "pending" | "ongoing" | "finished",
                result: number[],
                winsForEnd: number,
                winner: "1" | "2" | null,
                startedAt: number | null,
                finishedAt: number | null,
                id?: string)
    {
        this.id = id;
        this.participant1 = participant1;
        this.participant2 = participant2;
        this.games = games;
        this.state = state;
        this.result = result;
        this.winsForEnd = winsForEnd;
        this.winner = winner;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
    }

    isPlayable(): boolean {
        return (this.participant1 != null && this.participant2 != null);
    }

    addParticipant(bot: Bot): boolean {
        if(this.participant1 == undefined) {
            this.participant1 = bot;
            return true;
        }
        else if(this.participant2 == undefined) {
            this.participant2 = bot;
            this.state = "pending";
            this.onMatchReady.emit(this);
            return true
        }
        else {
            return false;
        }
    }

    reportGame(game: IGame): void {
        this.games.push(game);
        if(this.games.length == 1 && this.state == "pending") {
            this.state = "ongoing";
            this.startedAt = Date.now();
            this.onMatchStarted.emit(this);
        }

        //TODO: determine result, winner & end of the match
    }
}
*/
export class StarcraftMatch implements IMatch {

    id: string | undefined;
    indexId: IndexId | undefined;
    players: IPlayer[];
    result: number[];
    bestOf: number;
    games: IStarcraftGame[];
    status: "waiting" | "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    constructor(players: IPlayer[], 
                result: number[], 
                bestOf: number, 
                games: IStarcraftGame[], 
                status: "waiting" | "pending" | "ongoing" | "finished", 
                startedAt: number | null, 
                finishedAt: number | null,
                id?: string,
                indexId?: IndexId)
    {
        this.players = players;
        this.result = result;
        this.bestOf = bestOf;
        this.games = games;
        this.status = status;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.id = id;
        this.indexId = indexId;
    }

    addPlayer(player: IPlayer): boolean {
        if(this.players.length < 2) {
            this.players.push(player);
            if(this.players.length == 2) this.status = "pending";
            return true;
        }
        else {
            return false;
        }
    }

}