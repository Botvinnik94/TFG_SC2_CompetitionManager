import { ITournament } from "./ITournament";
import { IMatch } from "./IMatch";
import { IRanking } from "./IRanking";

export interface ITournamentFactory<TMatch extends IMatch, TRanking extends IRanking> {

    createTournament(name: string): ITournament<TMatch, TRanking>;

}