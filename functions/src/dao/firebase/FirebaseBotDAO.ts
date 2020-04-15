import { AbstractPlayerDAO } from "../AbstractPlayerDAO";
import { Bot } from "../../model/StarcraftTournamentElements/Bot";
import { Db } from "../../firebase/Db";
import { BotFirebaseConverter } from "./Converters/BotFirebaseConverter";

export class FirebaseBotDAO extends AbstractPlayerDAO<Bot> {

    async update(player: Bot): Promise<void> {
        const converter = new BotFirebaseConverter();
        const target = converter.toFirestore(player);

        await Db.collection('bots').doc(player.id).update(target);
    }

    async findOne(id: string): Promise<Bot> {

        const snapshot = await Db.collection('bots').doc(id).get();
        const converter = new BotFirebaseConverter();
        const bot = converter.fromFirestore(snapshot);

        if(bot) return bot;
        else throw new Error(`Bot ${id} not found in DB`);
    }

}