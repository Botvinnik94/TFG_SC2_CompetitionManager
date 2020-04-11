import { IPlayer } from "../IPlayer";

export interface IStarcraftGame {

    participant1: IPlayer;
    participant2: IPlayer;
    winner: 0 | 1 | "draw";
    map: string;

}