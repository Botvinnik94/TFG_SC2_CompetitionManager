import * as functions from 'firebase-functions';
import * as express from 'express';
//import * as cors from 'cors';
import { StarcraftTournamentManagerController } from './controllers/StarcraftTournamentManagerController';
import { StarcraftTournamentSerializer } from './utils/Serializers/StarcraftTournamentSerializer';
import { adminAuth, botAuth } from './middleware/Auth';
import { StarcraftMatchSerializer } from './utils/Serializers/StarcraftMatchSerializer';
import { IMatchFilter } from './model/IMatchFilter';
import { ITournamentFilter } from './model/ITournamentFilter';
//import { app } from 'firebase-admin';

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

privateApp.put('/:id/startMatch', async (req, res) => {
    if(req.params.id && req.body.roundIndex != undefined && req.body.matchIndex != undefined) {
        const controller = new StarcraftTournamentManagerController();
        try {
            await controller.startMatch(req.params.id, {roundIndex: req.body.roundIndex, matchIndex: req.body.matchIndex})
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

privateApp.put('/:id/reportMatch', async (req, res) => {
    console.log(req.body)
    if(req.params.id && req.body.roundIndex != undefined && req.body.matchIndex != undefined && req.body.reportObject) {
        const controller = new StarcraftTournamentManagerController();
        try {
            await controller.reportMatch(req.params.id, {roundIndex: req.body.roundIndex, matchIndex: req.body.matchIndex}, req.body.reportObject)
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

publicApp.get('/matches', async (req, res) => {
    const controller = new StarcraftTournamentManagerController();
    try {
        const matchFilter: IMatchFilter = {
            status: req.query.status,
            playersId: [req.query.player1, req.query.player2],
            tournamentId: req.query.tournamentId
        }
        const matches = await controller.getMatches(matchFilter, Number.parseInt(req.query.limit))
        const serializer = new StarcraftMatchSerializer();
        const responseData = matches.map( match => {
            return serializer.serialize(match);
        });
        res.status(200).send(responseData);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(404);
    }
})

publicApp.post('/', adminAuth, async (req, res) => {
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
});

publicApp.get('/', async (req, res) => {
    const controller = new StarcraftTournamentManagerController();
    try {
        const tournamentFilter: ITournamentFilter = {
            status: req.query.status,
            type: req.query.type,
            fromDate: Number.parseInt(req.query.fromDate),
            toDate: Number.parseInt(req.query.toDate)
        }
        const tournaments = await controller.getTournaments(tournamentFilter, Number.parseInt(req.query.limit));
        const serializer = new StarcraftTournamentSerializer();
        const responseData = tournaments.map( tournament => {
            return serializer.serialize(tournament);
        })
        res.status(200).send(responseData);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(404);
    }
});

publicApp.delete('/:id', adminAuth, async (req, res) => {
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

publicApp.put('/:id/inscription', botAuth, async (req, res) => {
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

publicApp.delete('/:id/inscription', botAuth, async (req, res) => {
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