import { IFirestoreConverter } from "./IFirestoreConverter";
import { ITournament } from "../../../model/ITournament";
import { TournamentTypeSelector } from "../../../model/TournamentTypeSelector";
import { StarcraftTournamentElementsFactory } from "../../../model/StarcraftTournamentElements/StarcraftTournamentElementsFactory";
import { assignDefined } from "../../../utils/assignDefined";
import { Bot } from "../../../model/StarcraftTournamentElements/Bot";
import { StarcraftMatch } from "../../../model/StarcraftTournamentElements/StarcraftMatch";
import { StarcraftRanking } from "../../../model/StarcraftTournamentElements/StarcraftRanking";
import { StarcraftRound } from "../../../model/StarcraftTournamentElements/StarcraftRound";
import { IStarcraftGame } from "../../../model/StarcraftTournamentElements/IStarcraftGame";

export class StarcraftTournamentFirestoreConverter implements IFirestoreConverter<ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>> {

    toFirestore(tournament: ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>): FirebaseFirestore.DocumentData {

        const documentData: FirebaseFirestore.DocumentData = {
            name: tournament.name,
            status: tournament.status,
            type: tournament.type,
            startingDate: tournament.startingDate,
            startedAt: tournament.startedAt,
            finishedAt: tournament.finishedAt
        };

        documentData.rounds = tournament.rounds.map( round => {
            return {
                status: round.status,
                startedAt: round.startedAt,
                finishedAt: round.finishedAt,
                matches: round.matches.map( match => {
                            return {
                                id: match.id,
                                tournamentId: match.tournamentId,
                                indexId: match.indexId,
                                players: match.players.map( player => {
                                    return assignDefined({}, player);
                                }),
                                bestOf: match.bestOf,
                                games: match.games.map( game => {
                                    return {
                                        participant1: assignDefined({}, game.participant1),
                                        participant2: assignDefined({}, game.participant2),
                                        winner: game.winner,
                                        map: game.map,
                                        replayURL: game.replayURL
                                    }
                                }),
                                result: match.result,
                                status: match.status,
                                startedAt: match.startedAt,
                                finishedAt: match.finishedAt
                            }
                        })
            };
        });

        documentData.rankings = tournament.rankings.map( ranking => {
            return {
                player: assignDefined({}, ranking.player),
                for: ranking.for,
                against: ranking.against,
                wins: ranking.wins,
                draws: ranking.draws,
                loses: ranking.loses
            };
        });

        return documentData;
    }

    fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): ITournament<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound> | undefined {
        const data = snapshot.data();
        if(data) {
            const starcraftElementsFactory = new StarcraftTournamentElementsFactory();

            const rounds = data.rounds.map( (roundData: any) => {
                const matches = roundData.matches.map( (matchData: any) => {
                    const players: Bot[] = matchData.players.map( (playerData: any) => {
                        return new Bot(playerData.id, playerData.name, playerData.uid,
                                       playerData.script, playerData.race, playerData.elo,
                                       playerData.username, playerData.useravatar, playerData.tournamentWins)
                    });
                    const games: IStarcraftGame[] = matchData.games.map ( (gameData: any) => {
                        return {
                            participant1: new Bot(gameData.participant1.id, gameData.participant1.name, gameData.participant1.uid,
                                                  gameData.participant1.script, gameData.participant1.race, gameData.participant1.elo,
                                                  gameData.participant1.username, gameData.participant1.useravatar, gameData.participant1.tournamentWins),
                            participant2: new Bot(gameData.participant2.id, gameData.participant2.name, gameData.participant2.uid,
                                                  gameData.participant2.script, gameData.participant2.race, gameData.participant2.elo,
                                                  gameData.participant2.username, gameData.participant2.useravatar, gameData.participant2.tournamentWins),
                            winner: gameData.winner,
                            map: gameData.map,
                            replayURL: gameData.replayURL
                        }
                    });
                    return starcraftElementsFactory.createTournamentMatch(  matchData.indexId,
                                                                            matchData.tournamentId,
                                                                            players,
                                                                            matchData.result,
                                                                            matchData.status,
                                                                            matchData.startedAt,
                                                                            matchData.finishedAt,
                                                                            matchData.id,
                                                                            games,
                                                                            matchData.bestOf);
                });
                return starcraftElementsFactory.createTournamentRound(matches, roundData.status, roundData.startedAt, roundData.finishedAt);
            });

            const rankings = data.rankings.map( (rankingData: any) => {
                return starcraftElementsFactory.createTournamentRanking(
                    new Bot(rankingData.player.id, rankingData.player.name, rankingData.player.uid,
                            rankingData.player.script, rankingData.player.race, rankingData.player.elo,
                            rankingData.player.username, rankingData.player.useravatar, rankingData.tournamentWins),
                    rankingData.for,
                    rankingData.against,
                    rankingData.wins,
                    rankingData.draws,
                    rankingData.loses
                )
            })

            const tournamentTypeSelector = new TournamentTypeSelector<Bot, StarcraftMatch, StarcraftRanking, StarcraftRound>();
            return tournamentTypeSelector.getTournamentFactory(data.type)
                                         .createTournament( data.name,
                                                            data.startingDate,
                                                            new StarcraftTournamentElementsFactory(),
                                                            data.status,
                                                            undefined,
                                                            rankings,
                                                            rounds,
                                                            data.startedAt,
                                                            data.finishedAt,
                                                            snapshot.id);
        }
        else return undefined;
    }

}