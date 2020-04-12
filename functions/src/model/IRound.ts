import { IMatch } from "./IMatch";
import { SubEvent } from "sub-events";
import { IPlayer } from "./IPlayer";

export interface IRound<TPlayer extends IPlayer, TMatch extends IMatch<TPlayer>> {

    matches: TMatch[];
    status: "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    readonly onRoundFinished: SubEvent<void>
    readonly onRoundStarted: SubEvent<void>

    onMatchStartedHandler(): void;
    onMatchReadyHandler(): void;
    onMatchFinishedHandler(): void;

    addMatch(match: TMatch): void;
}