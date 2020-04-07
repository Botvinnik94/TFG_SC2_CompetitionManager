import { IMatchFactory } from "../IMatchFactory";
import { StarcraftMatch } from "./StarcraftMatch";


export class StarcraftMatchFactory implements IMatchFactory<StarcraftMatch> {

    private bestOf: number;

    constructor(bestOf: number) {
        this.bestOf = bestOf;
    }

    createMatch(): StarcraftMatch {
        return new StarcraftMatch([], [0,0], this.bestOf, [], "waiting", null, null)
    }

}