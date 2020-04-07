import { IPlayer } from './IPlayer';

export interface IRanking {

    player: IPlayer;
    for: number;
    against: number;
    wins: number;
    draws: number;
    loses: number;

}