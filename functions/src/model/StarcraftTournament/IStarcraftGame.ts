import { IPlayer } from "../IPlayer";

export interface IStarcraftGame {

    participant1: IPlayer;
    participant2: IPlayer;
    winner: "1" | "2" | "draw" | null;
    state: "pending" | "ongoing" | "finished";
    map: string;
    startedAt: number | null
    finishedAt: number | null

}