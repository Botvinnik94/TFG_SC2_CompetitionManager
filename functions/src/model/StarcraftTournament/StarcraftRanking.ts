import { IRanking } from "../IRanking";
import { IPlayer } from "../IPlayer";

export class StarcraftRanking implements IRanking {

    player: IPlayer;
    for: number;
    against: number;
    wins: number;
    draws: number;
    loses: number;

    constructor(player: IPlayer, scoreFor: number, scoreAgainst: number, wins: number, draws: number, loses: number)
    {
        this.player = player;
        this.for = scoreFor;
        this.against = scoreAgainst;
        this.wins = wins;
        this.draws = draws;
        this.loses = loses;
    }
}