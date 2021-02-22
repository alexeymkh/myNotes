const Express = require('express');

const notesCtrl = require('../controllers/notes');
const notesValidators = require('../middlewares/validators/notes');

const router = Express.Router();

module.exports = () => {
    router.post(`/notes`, notesValidators.create(), (...args) => notesCtrl.create(...args));
    router.get(`/notes`, notesValidators.list(), (...args) => notesCtrl.list(...args));
    router.get(`/notes/:mongoId`, notesValidators.read(), (...args) => notesCtrl.read(...args));
    router.put(`/notes/:mongoId`, notesValidators.update(), (...args) => notesCtrl.update(...args));
    router.delete(`/notes/:mongoId`, notesValidators.delete(), (...args) => notesCtrl.delete(...args));

    return router;
}