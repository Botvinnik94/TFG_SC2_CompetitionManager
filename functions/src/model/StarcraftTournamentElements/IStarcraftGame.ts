import { Bot } from "./Bot";

export interface IStarcraftGame {

    participant1: Bot;
    participant2: Bot;
    winner: 0 | 1 | "draw";
    map: string;

}