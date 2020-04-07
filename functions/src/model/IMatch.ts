import { IPlayer } from "./IPlayer";

export interface IMatch {

    players: IPlayer[];
    result: number[];
    status: "waiting" | "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    addPlayer(player: IPlayer): boolean;
}