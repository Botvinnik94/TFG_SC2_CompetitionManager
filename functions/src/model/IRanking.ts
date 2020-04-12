import { IPlayer } from './IPlayer';

export interface IRanking<TPlayer extends IPlayer> {

    player: TPlayer;
    for: number;
    against: number;
    wins: number;
    draws: number;
    loses: number;

}