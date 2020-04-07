import { IMatch } from "./IMatch";

export interface IRound<TMatch extends IMatch> {

    matches: TMatch[];
    status: "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

}