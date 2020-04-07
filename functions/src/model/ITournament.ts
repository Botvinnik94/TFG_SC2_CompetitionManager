import { IMatch } from "./IMatch";
import { IRound } from "./IRound";
import { IRanking } from "./IRanking";
import { IPlayer } from "./IPlayer";
import { IMatchFactory } from "./IMatchFactory";
import { IRankingFactory } from "./IRankingFactory";

export interface ITournament<TMatch extends IMatch, TRanking extends IRanking> {

    id: string | undefined;
    name: string;
    rounds: IRound<TMatch>[];
    rankings: TRanking[];
    players: IPlayer[];
    status: "open" | "pending" | "ongoing" | "finished"
    startedAt: number | null;
    finishedAt: number | null;

    score(match: TMatch): boolean;
    findMatches(status?: "waiting" | "pending" | "ongoing" | "finished", playerId?: string, roundNumber?: number): TMatch[];
    results(playerId: string): TRanking | undefined;

    initializeTournament(matchFactory: IMatchFactory<TMatch>, rankingFactory: IRankingFactory<TRanking>): void;
}