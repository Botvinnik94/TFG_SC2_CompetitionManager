import { ITournament } from "../model/ITournament";
import { ITournamentFilter } from "../model/ITournamentFilter";
import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";

export abstract class AbstractTournamentDAO<TPlayer extends IPlayer, 
                                            TMatch extends IMatch<TPlayer>, 
                                            TRanking extends IRanking<TPlayer>, 
                                            TRound extends IRound<TPlayer, TMatch>>
{
    abstract findOne(id: string): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>>;
    abstract find(tournamentFilter: ITournamentFilter, limit?: number): Promise<ITournament<TPlayer, TMatch, TRanking, TRound>[]>
    abstract create(tournament: ITournament<TPlayer, TMatch, TRanking, TRound>): Promise<string>;
    abstract update(tournament: ITournament<TPlayer, TMatch, TRanking, TRound>): Promise<void>;
    abstract delete(id: string): Promise<void>;

    abstract enrollPlayer(player: IPlayer, tournamentId: string): Promise<void>;
    abstract withdrawPlayer(playerId: string, tournamentId: string): Promise<void>;
}