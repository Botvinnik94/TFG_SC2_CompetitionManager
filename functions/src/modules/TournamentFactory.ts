import * as tournament from 'tournament'
import * as GroupStage from 'groupstage'
import * as Duel from 'duel'
import { Competition } from '../model/Competition'

export class TournamentFactory {

    public static getTournament(competition: Competition): tournament {

        switch (competition.type) {
            case "round-robin":
                return new GroupStage(competition.participants.length)
        
            case "single-elimination":
                return new Duel(competition.participants.length)

            case "double-elimination":
                return new Duel(competition.participants.length, { last: Duel.LB });
        }

    }

}