import { IPlayer } from "./IPlayer";
import { SubEvent } from "sub-events";
import { IndexId } from "./IndexId";

export interface IMatch<TPlayer extends IPlayer> {

    id: string | undefined;
    indexId: IndexId;
    tournamentId: string | undefined;
    players: TPlayer[];
    result: number[];
    status: "waiting" | "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    readonly onMatchReady: SubEvent<void>;
    readonly onMatchStarted: SubEvent<void>;
    readonly onMatchFinished: SubEvent<{winner: number, elos: number[]}>; // Gives winner position & array of elos of each player after the match
    readonly onMatchScore: SubEvent<number>;    // Gives score player position

    addPlayer(player: TPlayer): void;
    start(): void;
    score(resultObject: Object, ranked?: boolean): void;
}