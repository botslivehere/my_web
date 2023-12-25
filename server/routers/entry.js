const express = require('express');

const { entry_by_id,entry_create,entry_toggle,entry_remove } = require('../functions/entry');

const router = express.Router();

router.post('/entry', async (req, res) => {
    try {
    console.log(req.body);
    const jsonObject = req.body.id;
    const formattedDate = jsonObject.split('T')[0];
    console.log(formattedDate);
    if (!formattedDate) {
        throw new Error('Invalid input format');
    }
    const userid = req.session.key[req.sessionID].id;
    let entry = await entry_by_id(formattedDate,userid);
    entry=entry.sort((a,b)=>a.id-b.id);
    res.send(entry);
    return;
    } catch (error) {
        res.status(400).send({ status: 'Error', message: error.message });
    }
})

router.post('/entry_create', async (req, res) => {
    try{
    const jsonObject = req.body.date;
    const formattedDate = jsonObject.split('T')[0];
    if (!formattedDate || !req.body.text || typeof req.body.completed !== 'boolean') {
        throw new Error('Invalid input format');
    }
    let entry = await entry_create(formattedDate,req.body.text,req.body.completed,req.session.key[req.sessionID].id);
    res.send(entry);
    return;
} catch (error) {
    res.status(400).send({ status: 'Error', message: error.message });
}
})

router.post('/entry_toggle', async (req, res) => {
    try {
    const id = req.body.id;
    const userid = req.session.key[req.sessionID].id;
    if (!id || typeof id !== 'number') {
        throw new Error('Invalid input format');
    }
    let entry = await entry_toggle(id,userid);
    res.send(entry);
    return;
    } catch (error) {
        res.status(400).send({ status: 'Error', message: error.message });
    }
})

router.post('/entry_remove', async (req, res) => {
    try {
        const id = req.body.id;
        const userid = req.session.key[req.sessionID].id;
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid input format');
        }
        let entry = await entry_remove(id, userid);
        if (entry) {
            res.status(200).send({ status: 'Deleted' });
        } else {
            res.status(404).send({ status: 'Error', message: 'Entry not found' });
        }
    } catch (error) {
        res.status(400).send({ status: 'Error', message: error.message });
    }
});


module.exports = router;