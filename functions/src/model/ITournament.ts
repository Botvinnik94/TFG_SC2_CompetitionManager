import { IMatch } from "./IMatch";
import { IRound } from "./IRound";
import { IRanking } from "./IRanking";
import { IPlayer } from "./IPlayer";
import { ITournamentElementsFactory } from "./ITournamentElementsFactory";
import { IndexId } from "./IndexId";

export interface ITournament<TPlayer extends IPlayer, 
                             TMatch extends IMatch<TPlayer>, 
                             TRanking extends IRanking<TPlayer>, 
                             TRound extends IRound<TPlayer, TMatch>>
{

    id: string | undefined;
    name: string;
    rounds: TRound[];
    rankings: TRanking[];
    players: TPlayer[];
    status: "open" | "pending" | "ongoing" | "finished";
    startingDate: number;
    startedAt: number | null;
    finishedAt: number | null;

    readonly type: string;
    tournamentElementsFactory: ITournamentElementsFactory<TPlayer, TMatch, TRanking, TRound>;

    enrollPlayer(player: TPlayer): void;
    withdrawPlayer(playerId: string): void;

    findMatches(status?: "waiting" | "pending" | "ongoing" | "finished", playerId?: string, roundNumber?: number): TMatch[];
    results(playerId: string): TRanking | undefined;

    initializeTournament(): void;
    scoreMatch(indexId: IndexId, resultObject: Object, ranked?: boolean): void;

    onRoundStartedHandler(): void;
    onRoundFinishedHandler(): void
}