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

    /**
     * Registers a new player in the tournament
     * @param player The player to register
     */
    enrollPlayer(player: TPlayer): void;

    /**
     * Withdraws a player from the tournament
     * @param playerId The id of the player that its already registered in the tournament
     */
    withdrawPlayer(playerId: string): void;

    /**
     * Returns a list of matches from the tournament that meet certain criteria
     * @param status The status of the match
     * @param playerId The id of a player participanting in it
     * @param roundNumber The number of the round the match is in
     */
    findMatches(status?: "waiting" | "pending" | "ongoing" | "finished", playerId?: string, roundNumber?: number): TMatch[];

    /**
     * Returns the statistics of a player in a tournament
     * @param playerId 
     */
    results(playerId: string): TRanking | undefined;

    /**
     * Initializes the tournament, closing inscriptions, changing its status and creating all corresponding matches
     */
    initializeTournament(): void;

    /**
     * Reports the result of a match in the tournament
     * @param indexId The number of round and number of match in that round that is being reported
     * @param resultObject The result of the match
     * @param ranked If the match changes the elo of the players
     */
    scoreMatch(indexId: IndexId, resultObject: Object, ranked?: boolean): void;

    onRoundStartedHandler(): void;
    onRoundFinishedHandler(): void
}