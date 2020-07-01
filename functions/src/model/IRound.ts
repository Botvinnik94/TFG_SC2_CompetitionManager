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
    readonly onMatchScore: SubEvent<{matchIndex: number, position: number}>     // Gives score player position
    readonly onMatchFinished: SubEvent<{matchIndex: number, info: {winner: number, elos: number[]}}>  // Gives winner player position & array of elos of each player after the match

    onMatchStartedHandler(): void;
    onMatchReadyHandler(): void;
    onMatchFinishedHandler(): void;

    /**
     * Adds a new match to the round
     * @param match 
     */
    addMatch(match: TMatch): void;
}