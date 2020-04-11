import { IMatch } from "./IMatch";
import { SubEvent } from "sub-events";

export interface IRound {

    matches: IMatch[];
    status: "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    readonly onRoundFinished: SubEvent<void>
    readonly onRoundStarted: SubEvent<void>

    onMatchStartedHandler(): void;
    onMatchReadyHandler(): void;
    onMatchFinishedHandler(): void;

    addMatch(match: IMatch): void;
}