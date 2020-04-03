import { Bot } from "./Bot";
import { IRound } from "./IRound";
import { IRanking } from "./IRanking";

export class Competition {

    id: string | undefined;
    participants: Bot[];
    name: string;
    type: "round-robin" | "single-elimination" | "double-elimination";
    rounds: IRound[];
    rankings: IRanking[];
    status: "open" | "pending" | "ongoing" | "completed";
    startingDate: number;
    startedAt: number | null;
    finishedAt: number | null;


    constructor(participants: Bot[],
                name: string,
                type: "round-robin" | "single-elimination" | "double-elimination",
                rounds: IRound[],
                rankings: IRanking[],
                status: "open" | "pending" | "ongoing" | "completed",
                startingDate: number,
                startedAt: number | null,
                finishedAt: number | null,
                id?: string)
    {
        this.participants = participants;
        this.name = name;
        this.type = type;
        this.rounds = rounds;
        this.rankings = rankings;
        this.status = status;
        this.startingDate = startingDate;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.id = id;
    }

}