import * as functions from 'firebase-functions';

import { CompetitionInitializer } from './modules/CompetitionInitializer';
import { Container } from './dao/Container';
import { PersistenceType } from './dao/PersistenceType';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    const com = new CompetitionInitializer(Container.getDAOFactory(PersistenceType.Firebase).getCompetitionDAO())
    com.initialize("2VCfFqLmrwXL6m7I0UQn")
    response.send("Hello from Firebase!");
});



