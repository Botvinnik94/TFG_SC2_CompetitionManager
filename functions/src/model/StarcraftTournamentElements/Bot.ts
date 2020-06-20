import { IPlayer } from "../IPlayer";

export class Bot implements IPlayer {

    id: string;
    name: string;
    uid: string;
    username: string | undefined;
    useravatar: string | undefined;
    race: string;
    script: string;
    elo: number;
    tournamentWins: string[];

    constructor(id: string, name: string, uid: string, script: string, race: string, elo: number, username?: string, useravatar?: string, tournamentWins?: string[]) {
        this.name = name;
        this.uid = uid;
        this.script = script;
        this.race = race;
        this.elo = elo;
        this.id = id;
        this.username = username;
        this.useravatar = useravatar;
        this.tournamentWins = tournamentWins ?? []
    }
}