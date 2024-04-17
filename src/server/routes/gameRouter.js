const express = require('express');
const gameController = require('../controllers/gameController.js')

const router = express.Router();

/* GET request is sent with a parameter labeled guess which contains the client's n digit guess */
router.get('/guess/:guess', gameController.guess, (req, res, next) => {
    return res.status(200).send(res.locals.data);
 })

 /* GET request will make a query to the database for game config data */
router.get('/gameSettings', gameController.getGameSettings, (req, res, next) => {
    return res.status(200).json(res.locals.gameSettings);
})

/* GET request will make a query to the database for current game stats */
router.get('/currentGame', gameController.getCurrentGameData, (req, res, next) => {
    return res.status(200).json(res.locals);
})

/* GET request will generate and return a random n digit number as a string */
router.get('/newGame', gameController.startNewGame, (req, res, next) => {
    return res.status(200).json(res.locals.randomNums);
})

/* GET request is sent with a parameter labeled difficulty which will be sent in a database query */
router.get('/changeDifficulty/:difficulty', gameController.changeDifficulty, (req, res, next) => {
    return res.status(200).json(res.locals.difficulty);
})

/* GET request will make a query to the database to reset the scores */
router.get('/resetHighScore', gameController.resetHighScore, (req, res, next) => {
    return res.status(200).json(res.locals.scores);
})


module.exports = router;