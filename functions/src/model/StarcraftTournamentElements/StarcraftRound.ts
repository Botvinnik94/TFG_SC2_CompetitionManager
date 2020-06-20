import { IRound } from "../IRound";
import { StarcraftMatch } from "./StarcraftMatch";
import { SubEvent } from "sub-events";
import { Bot } from "./Bot";

export class StarcraftRound implements IRound<Bot, StarcraftMatch> {

    matches: StarcraftMatch[];
    status: "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    readonly onRoundFinished: SubEvent<void> = new SubEvent();
    readonly onRoundStarted: SubEvent<void> = new SubEvent();
    readonly onMatchScore: SubEvent<{matchIndex: number, position: number}> = new SubEvent();
    readonly onMatchFinished: SubEvent<{matchIndex: number, info: {winner: number, elos: number[]}}> = new SubEvent();

    constructor(matches: StarcraftMatch[],
                status: "pending" | "ongoing" | "finished",
                startedAt: number | null,
                finishedAt: number | null)
    {
        this.matches = matches;
        this.status = status;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;

        this.matches.forEach( match => {
            this.subscribeToMatchEvents(match);
        });
    }

    addMatch(match: StarcraftMatch): void {
        this.matches.push(match);
        this.subscribeToMatchEvents(match);
    }

    onMatchStartedHandler(): void {
        if(this.status != "ongoing") {
            this.status = "ongoing";
            this.onRoundStarted.emit();
        }
        if(this.startedAt == null) this.startedAt = Date.now();
    }

    onMatchReadyHandler(): void {
        return
    }

    onMatchFinishedHandler(): void {
        const matchNotFinished = this.matches.find( match => {
            return (match.status !== "finished")
        });

        if(matchNotFinished == undefined) {
            this.status = "finished"
            this.finishedAt = Date.now();
            this.onRoundFinished.emit();
        }
    }

    private subscribeToMatchEvents(match: StarcraftMatch): void {
        match.onMatchStarted.subscribe(() => {
            this.onMatchStartedHandler();
        });
        match.onMatchFinished.subscribe((info) => {
            this.onMatchFinished.emit({matchIndex: match.indexId.matchIndex, info: info});
            this.onMatchFinishedHandler();
        });
        match.onMatchScore.subscribe((position) => {
            this.onMatchScore.emit({matchIndex: match.indexId.matchIndex, position: position});
        })
    }
}