import { IPlayer } from "../model/IPlayer";
import { IMatch } from "../model/IMatch";
import { IRanking } from "../model/IRanking";
import { IRound } from "../model/IRound";
import { AbstractTournamentDAO } from "../dao/AbstractTournamentDAO";
import { AbstractMatchDAO } from "../dao/AbstractMatchDAO";
import { ITournament } from "../model/ITournament";
import { TournamentService } from "./TournamentService";
import { AbstractPlayerDAO } from "../dao/AbstractPlayerDAO";

export class TournamentServiceFactory<  TPlayer extends IPlayer, 
                                        TMatch extends IMatch<TPlayer>, 
                                        TRanking extends IRanking<TPlayer>, 
                                        TRound extends IRound<TPlayer, TMatch>> {

    async createTournamentService(tournamentDAO: AbstractTournamentDAO<TPlayer, TMatch, TRanking, TRound>,
                                  matchDAO: AbstractMatchDAO<TPlayer, TMatch>,
                                  playerDAO: AbstractPlayerDAO<TPlayer>,
                                  tournament: ITournament<TPlayer, TMatch, TRanking, TRound> | string)
    {
        var actualTournament: ITournament<TPlayer, TMatch, TRanking, TRound>;

        if(typeof tournament === "string")
        {
            actualTournament = await tournamentDAO.findOne(tournament);
        }
        else {
            actualTournament = tournament;
        }

        return new TournamentService(tournamentDAO, matchDAO, playerDAO, actualTournament);
    }

}