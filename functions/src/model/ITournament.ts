import { IMatch } from "./IMatch";
import { IRound } from "./IRound";
import { IRanking } from "./IRanking";
import { IPlayer } from "./IPlayer";
import { ITournamentElementsFactory } from "./ITournamentElementsFactory";
import { IndexId } from "./IndexId";

export interface ITournament {

    id: string | undefined;
    name: string;
    rounds: IRound[];
    rankings: IRanking[];
    players: IPlayer[];
    status: "open" | "pending" | "ongoing" | "finished"
    startedAt: number | null;
    finishedAt: number | null;

    enrollPlayer(player: IPlayer): void;
    withdrawPlayer(playerId: string): void;

    findMatches(status?: "waiting" | "pending" | "ongoing" | "finished", playerId?: string, roundNumber?: number): IMatch[];
    results(playerId: string): IRanking | undefined;

    initializeTournament(tournamentFactory: ITournamentElementsFactory): void;
    scoreMatch(indexId: IndexId, resultObject: Object): void;

    onRoundStartedHandler(): void;
    onRoundFinishedHandler(): void
}