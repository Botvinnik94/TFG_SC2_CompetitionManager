import { Bot } from "../../model/StarcraftTournamentElements/Bot";

export interface IUser {

    uid: string,
    name: string,
    isAdmin: boolean,
    bots: Bot[]
}