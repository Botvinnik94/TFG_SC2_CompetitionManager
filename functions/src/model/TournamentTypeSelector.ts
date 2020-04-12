import { ITournamentFactory } from "./ITournamentFactory";
import { RoundRobinFactory } from "./Tournaments/RoundRobinFactory";
import { IPlayer } from "./IPlayer";
import { IMatch } from "./IMatch";
import { IRanking } from "./IRanking";
import { IRound } from "./IRound";

export class TournamentTypeSelector<TPlayer extends IPlayer, 
                                    TMatch extends IMatch<TPlayer>, 
                                    TRanking extends IRanking<TPlayer>, 
                                    TRound extends IRound<TPlayer, TMatch>>
{

    public getTournamentFactory(type: "round-robin"): ITournamentFactory<TPlayer, TMatch, TRanking, TRound> {
        switch (type) {
            case "round-robin":
                return new RoundRobinFactory<TPlayer, TMatch, TRanking, TRound>();

            default:
                throw new Error("Invalid tournament type");
        }
    }

}