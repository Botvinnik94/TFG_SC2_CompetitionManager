import { IPlayer } from "./IPlayer";
import { SubEvent } from "sub-events";

export interface IMatch {

    players: IPlayer[];
    result: number[];
    status: "waiting" | "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    readonly onMatchReady: SubEvent<void>;
    readonly onMatchStarted: SubEvent<void>;
    readonly onMatchFinished: SubEvent<void>;

    addPlayer(player: IPlayer): void;
    start(): void;
    score(resultObject: Object): void;
}