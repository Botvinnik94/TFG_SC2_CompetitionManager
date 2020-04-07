import * as functions from 'firebase-functions';

import { TournamentManagerController } from './modules/TournamentManagerController';
import { Container } from './dao/Container';
import { PersistenceType } from './dao/PersistenceType';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    const com = new TournamentManagerController(Container.getDAOFactory(PersistenceType.Firebase).getTournamentDAO())
    com.initializeTournament("2VCfFqLmrwXL6m7I0UQn")
    response.send("Hello from Firebase!");
});



