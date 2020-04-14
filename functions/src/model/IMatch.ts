import { IPlayer } from "./IPlayer";
import { SubEvent } from "sub-events";
import { IndexId } from "./IndexId";

export interface IMatch<TPlayer extends IPlayer> {

    indexId: IndexId;
    tournamentId: string | undefined;
    players: TPlayer[];
    result: number[];
    status: "waiting" | "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    readonly onMatchReady: SubEvent<void>;
    readonly onMatchStarted: SubEvent<void>;
    readonly onMatchFinished: SubEvent<void>;

    addPlayer(player: TPlayer): void;
    start(): void;
    score(resultObject: Object, ranked?: boolean): void;
}