import { Bot } from './Bot';
import { IGame } from './IGame';

export class Match {

    id: string | undefined;
    participant1: Bot;
    participant2: Bot;
    games: IGame[];
    state: "pending" | "ongoing" | "finished";
    result: string;
    winner: "1" | "2" | null;
    startedAt: number | null;
    finishedAt: number | null;

    constructor(participant1: Bot,
                participant2: Bot,
                games: IGame[],
                state: "pending" | "ongoing" | "finished",
                result: string,
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
        this.winner = winner;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
    }

}