import { ITournament } from "./ITournament";

export interface ITournamentFactory {

    createTournament(name: string): ITournament

}