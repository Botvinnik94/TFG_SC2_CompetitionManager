import { IRanking } from "./IRanking";
import { IPlayer } from "./IPlayer";

export interface IRankingFactory<TRanking extends IRanking> {

    createRanking(player: IPlayer): TRanking;

}