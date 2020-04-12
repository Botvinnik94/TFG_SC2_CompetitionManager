import { IFirestoreConverter } from "./IFirestoreConverter";
import { StarcraftMatch } from "../../../model/StarcraftTournamentElements/StarcraftMatch";
import { assignDefined } from "../../../utils/assignDefined";
import { StarcraftTournamentElementsFactory } from "../../../model/StarcraftTournamentElements/StarcraftTournamentElementsFactory";
import { Bot } from "../../../model/StarcraftTournamentElements/Bot";
import { IStarcraftGame } from "../../../model/StarcraftTournamentElements/IStarcraftGame";

export class StarcraftMatchFirestoreConverter implements IFirestoreConverter<StarcraftMatch> {

    toFirestore(match: StarcraftMatch): FirebaseFirestore.DocumentData {

        const documentData: FirebaseFirestore.DocumentData = {
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
                    map: game.map
                }
            }),
            result: match.result,
            status: match.status,
            startedAt: match.startedAt,
            finishedAt: match.finishedAt
        };

        return documentData;

    }

    fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): StarcraftMatch | undefined {
        const data = snapshot.data();
        if(data) {
            const players: Bot[] = data.players.map( (playerData: any) => {
                return new Bot(playerData.id, playerData.name, playerData.uid,
                               playerData.script, playerData.race, playerData.elo,
                               playerData.username, playerData.useravatar)
            });
            const games: IStarcraftGame[] = data.games.map ( (gameData: any) => {
                return {
                    participant1: new Bot(gameData.participant1.id, gameData.participant1.name, gameData.participant1.uid,
                                          gameData.participant1.script, gameData.participant1.race, gameData.participant1.elo,
                                          gameData.participant1.username, gameData.participant1.useravatar),
                    participant2: new Bot(gameData.participant2.id, gameData.participant2.name, gameData.participant2.uid,
                                          gameData.participant2.script, gameData.participant2.race, gameData.participant2.elo,
                                          gameData.participant2.username, gameData.participant2.useravatar),
                    winner: gameData.winner,
                    map: gameData.map
                }
            });
            const starcraftElementsFactory = new StarcraftTournamentElementsFactory();
            return starcraftElementsFactory.createTournamentMatch(  data.indexId,
                                                                    data.tournamentId,
                                                                    players,
                                                                    data.result,
                                                                    data.status,
                                                                    data.startedAt,
                                                                    data.finishedAt,
                                                                    data.id,
                                                                    games,
                                                                    data.bestOf);
        }
        else return undefined;
    }

}