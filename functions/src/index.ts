import * as functions from 'firebase-functions';
import * as express from 'express';
//import * as cors from 'cors';
import { StarcraftTournamentManagerController } from './controllers/StarcraftTournamentManagerController';
import { StarcraftTournamentSerializer } from './utils/Serializers/StarcraftTournamentSerializer';
import { auth } from './middleware/Auth';
import { StarcraftMatchSerializer } from './utils/Serializers/StarcraftMatchSerializer';

const privateApp = express();
const publicApp = express();

// const bodyParser = require('body-parser');
// publicApp.use(bodyParser.json());
// publicApp.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
publicApp.use(cors({ origin: true }));

// Private Api

privateApp.put('/:id/initialize', async (req, res) => {
    if(req.params.id) {
        const controller = new StarcraftTournamentManagerController();
        try {
            await controller.initializeTournament(req.params.id);
            res.sendStatus(200);
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(400);
    }
});

// Public Api

publicApp.get('/matches/:id', async (req, res) => {
    if(req.params.id) {
        const controller = new StarcraftTournamentManagerController();
        try {
            const match = await controller.getMatch(req.params.id);
            const serializer = new StarcraftMatchSerializer();
            res.status(200).send(serializer.serialize(match));
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(400);
    }
})

publicApp.post('/', auth, async (req, res) => {
    if(req.body.date && req.body.name && req.body.type) {
        const controller = new StarcraftTournamentManagerController();
        try {
            res.status(201).send(await controller.createTournament(req.body.type, req.body.name, req.body.date));
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(400);
    }
})

publicApp.get('/:id', async (req, res) => {
    if(req.params.id) {
        const controller = new StarcraftTournamentManagerController();
        try {
            const tournament = await controller.getTournament(req.params.id);
            const serializer = new StarcraftTournamentSerializer();
            res.status(200).send(serializer.serialize(tournament));
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(400);
    }
})

publicApp.delete('/:id', auth, async (req, res) => {
    if(req.params.id) {
        const controller = new StarcraftTournamentManagerController();
        try {
            await controller.deleteTournament(req.params.id);
            res.sendStatus(200);
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(400);
    }
})

publicApp.put('/:id/inscription', auth, async (req, res) => {
    if(req.params.id) {
        const controller = new StarcraftTournamentManagerController();
        try {
            await controller.enrollPlayer(req.body.player, req.params.id);
            res.sendStatus(200);
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(400);
    }
})

publicApp.delete('/:id/inscription', auth, async (req, res) => {
    if(req.params.id) {
        const controller = new StarcraftTournamentManagerController();
        try {
            await controller.withdrawPlayer(req.body.player, req.params.id);
            res.sendStatus(200);
        }
        catch(error) {
            console.error(error);
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(400);
    }
})

exports.api = functions.https.onRequest(publicApp);
exports.private = functions.https.onRequest(privateApp);