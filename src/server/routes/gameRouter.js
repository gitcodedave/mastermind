const express = require('express');
const gameController = require('../controllers/gameController.js')

const router = express.Router();

/* GET request is sent with a parameter labeled guess which contains the client's n digit guess */
router.get('/guess/:guess', gameController.guess, (req, res, next) => {
    return res.status(200).send(res.locals.data);
 })

 /* GET request will generate and return a random n digit number as a string */
router.get('/gameSettings', gameController.getGameSettings, (req, res, next) => {
    return res.status(200).json(res.locals.gameSettings);
})

router.get('/currentGame', gameController.getCurrentGameData, (req, res, next) => {
    return res.status(200).json(res.locals);
})

/* GET request will generate and return a random n digit number as a string */
router.get('/newGame', gameController.startNewGame, (req, res, next) => {
    return res.status(200).json(res.locals.randomNums);
})

/* GET request will generate and return a random n digit number as a string */
router.get('/changeDifficulty/:difficulty', gameController.changeDifficulty, (req, res, next) => {
    return res.status(200).json(res.locals.difficulty);
})

module.exports = router;