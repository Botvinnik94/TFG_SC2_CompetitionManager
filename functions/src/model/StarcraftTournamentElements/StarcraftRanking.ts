import { IRanking } from "../IRanking";
import { Bot } from "./Bot";

export class StarcraftRanking implements IRanking<Bot> {

    player: Bot;
    for: number;
    against: number;
    wins: number;
    draws: number;
    loses: number;

    constructor(player: Bot, scoreFor: number, scoreAgainst: number, wins: number, draws: number, loses: number)
    {
        this.player = player;
        this.for = scoreFor;
        this.against = scoreAgainst;
        this.wins = wins;
        this.draws = draws;
        this.loses = loses;
    }
}