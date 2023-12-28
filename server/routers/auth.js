const express = require('express');
const resolve = require('path').resolve
const { check_auth,create_user } = require('../functions/auth.js');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/auth', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (
            !login || !password ||
            typeof login !== 'string' || typeof password !== 'string' ||
            login.length < 8 || password.length < 8 || 
            login.length > 32 || password.length > 32 ||
            !/^[a-zA-Z0-9]+$/.test(login) || !/^[a-zA-Z0-9]+$/.test(password)
        ) {
            throw new Error('Invalid input format');
        }
        const fixedSalt = '$2a$10$abcdefghijklmnopqrstuu';
        const hashedPassword = await bcrypt.hash(password, fixedSalt);

        let id = await check_auth(login, hashedPassword);

        if (!id) {
            res.status(400).send({ status: 'Error', message: 'Invalid credentials' });
            return;
        }

        if (!req.session.key) {
            req.session.key = {};
        }

        if (!req.session.key[req.sessionID]) {
            req.session.key[req.sessionID] = {};
            req.session.key[req.sessionID].id = id;
            req.session.key[req.sessionID].session = req.session.id;
        }

        console.log(req.session.id);
        res.send(req.session.key[req.sessionID]).status(200);
    } catch (error) {
        res.status(400).send({ status: 'Error', message: error.message });
    }
});


router.get('/logout', (req, res) => {
    console.log(req.session.id);
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send({ status: 'Error', message: 'Failed to destroy session' });
            return;
        } else {
            res.status(200).send({ status: 'Deleted' });
            return;
        }
    });
});

router.post('/register', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (
            !login || !password ||
            typeof login !== 'string' || typeof password !== 'string' ||
            login.length < 8 || password.length < 8 ||
            login.length > 32 || password.length > 32 ||
            !/^[a-zA-Z0-9]+$/.test(login) || !/^[a-zA-Z0-9]+$/.test(password)
        ) {
            throw new Error('Invalid input format');
        }

        const fixedSalt = '$2a$10$abcdefghijklmnopqrstuu';
        const hashedPassword = await bcrypt.hash(password, fixedSalt);

        let id = await check_auth(login, hashedPassword);

        if (id) {
            res.status(400).send({ status: 'Error', message: 'User already exists' });
            return;
        }

        let userData = await create_user(login, hashedPassword);

        if (!userData) {
            res.status(500).send({ status: 'Error', message: 'Failed to register user' });
            return;
        }

        id = await check_auth(login, hashedPassword);

        if (!id) {
            res.status(400).send({ status: 'Error', message: 'Invalid credentials' });
            return;
        }

        if (!req.session.key) {
            req.session.key = {};
        }

        if (!req.session.key[req.sessionID]) {
            req.session.key[req.sessionID] = {};
            req.session.key[req.sessionID].session = req.session.id;
        }

        req.session.key[req.sessionID].id = id;
        res.send(req.session.key[req.sessionID]).status(200);

    } catch (error) {
        res.status(400).send({ status: 'Error', message: error.message });
    }
});


module.exports = router;