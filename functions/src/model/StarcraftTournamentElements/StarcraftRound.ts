import { IRound } from "../IRound";
import { StarcraftMatch } from "./StarcraftMatch";
import { SubEvent } from "sub-events";

/*import { IRound } from "../IRound";
import { Match } from "./StarcraftMatch";

export class Round implements IRound {

    matches: Match[];
    status: "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    constructor(matches: Match[], status: "pending" | "ongoing" | "finished", startedAt: number | null, finishedAt: number | null){
        this.matches = matches;
        this.status = status;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
    }

    addMatch(match: Match): void {
        this.matches.push(match);
        match.onMatchStarted.subscribe(() => {
            if(this.status != "ongoing") this.status = "ongoing";
            if(this.startedAt == null) this.startedAt = Date.now();
        });
        match.onMatchFinished.subscribe(() => {
            const matchNotFinished = this.matches.find( match => {
                return (match.state != "finished")
            });

            if(matchNotFinished == undefined) {
                this.status = "finished"
                this.finishedAt = Date.now();
            }
        });
    }

}
*/
export class StarcraftRound implements IRound {

    matches: StarcraftMatch[];
    status: "pending" | "ongoing" | "finished";
    startedAt: number | null;
    finishedAt: number | null;

    readonly onRoundFinished: SubEvent<void> = new SubEvent();
    readonly onRoundStarted: SubEvent<void> = new SubEvent();

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
            match.onMatchStarted.subscribe(() => {
                this.onMatchStartedHandler();
            });
            match.onMatchFinished.subscribe(() => {
                this.onMatchFinishedHandler();
            })
        });
    }

    addMatch(match: StarcraftMatch): void {
        this.matches.push(match);
        match.onMatchStarted.subscribe(() => {
            this.onMatchStartedHandler();
        });
        match.onMatchFinished.subscribe(() => {
            this.onMatchFinishedHandler();
        })
    }

    onMatchStartedHandler(): void {
        if(this.status != "ongoing") {
            this.status = "ongoing";
            this.onRoundStarted.emit();
        }
        if(this.startedAt == null) this.startedAt = Date.now();
    }

    onMatchReadyHandler(): void {}

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
}