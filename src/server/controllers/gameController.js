const db = require('../models/database.js')

const gameController = {};

/* getGameSettings makes a query to the database for game config data, and sends the info through the middleware */
gameController.getGameSettings = async (req, res, next) => {
    const gameSettings = await db.getGameSettingData();
    res.locals.gameSettings = gameSettings;
    next();
}

/* getGameSettings makes a query to the database for current game attempt data as well as the game config data, and sends it through the middleware 
    The game config data was only needed in order to provide the state of the player's game (has won, lost, or is still playing) */
gameController.getCurrentGameData = async (req, res, next) => {
    const currentGameData = await db.getCurrentGameData();
    const gameSettings = await db.getGameSettingData();
    res.locals.currentGameData = currentGameData;
    res.locals.gameStatus = gameSettings;
    next();
}

/* The difficulty setting is pulled from the req parameter, and passed to the database to update the game config */
gameController.changeDifficulty = async(req, res, next) => {
    let difficulty = req.params.difficulty;
    await db.changeDifficulty(difficulty);
    res.locals.difficulty = difficulty;
    next();
}

/* In order to start a new game the difficulty setting is required, so it is first queried from the database and then passed to the random API */
gameController.startNewGame = async(req, res, next) => {
    const gameData = await db.getGameSettingData();
    const difficulty = gameData.difficulty;
    const randomNums = await fetch(`https://www.random.org/integers/?num=${difficulty}&min=0&max=7&col=4&base=10&format=plain&rnd=new`)
        .then((data) => data.text());

    /* The API response data is normalized and then passed as an argument into the db.newGame method */
    await db.newGame(randomNums.replace(/\s/g, ''));
    res.locals.randomNums = randomNums.replace(/\s/g, '');
    next();
}

/*~ The main algorithm for the game functionality ~*/
gameController.guess = async (req, res, next) => {
    const gameSettings = await db.getGameSettingData();
    if(gameSettings.gameStatus == 'playing'){

    /* Constants are created to store the client's guess, as well as the secret number to compare with */
    const inputGuess = req.params.guess.split('');
    const inputGuessCache = req.params.guess.split('');

    const answerCache = gameSettings.secretNumber.toString().split('');
    const attemptNumber = gameSettings.attemptNumber+=1;

    let correctCount = 0;
    let correctLocation = 0;

    /* This will check to see how many of the numbers are perfect guesses */
    for(let i = 0; i < inputGuessCache.length; i++){
        if(inputGuessCache[i] === answerCache[i]){
            correctCount++;
            correctLocation++;
            answerCache[i] = 'x';
            inputGuessCache[i] = 'x';
        } 
    }
    /* Of the ones that are left, we check for how many are correct but in the wrong location */
    for(let i = 0; i < inputGuessCache.length; i++){
        if(inputGuessCache[i] === 'x') continue;
        if(answerCache.includes(inputGuessCache[i])){
            correctCount++;
            answerCache[answerCache.indexOf(inputGuessCache[i])] = 'x';
        } 
    }

    /* We are sending the data back as an object that the frontend will use to render components */
    res.locals.data = {
        attempt: attemptNumber,
        answer: gameSettings.secretNumber.toString(),
        myGuess: inputGuess.join(''),
        correctCount: correctCount,
        correctLocation: correctLocation,
        gameStatus: 'playing'
    }
    if(correctLocation === gameSettings.difficulty){
        res.locals.data.gameStatus = 'won'
    }
    if(attemptNumber >= 10){
        res.locals.data.gameStatus = 'lost'
    }

    /* After everything is calculated, we will update the database with the new attempt and game config info */
    await db.addGuessAttempt(res.locals.data)
    next();
    } 
    
    /* If the game status was already set to either 'won' or 'lost' we don't do anything until a new game is started */
    else {
        res.locals.data = {};
        res.locals.data.gameStatus = gameSettings.gameStatus;
        next();
    }
}

module.exports = gameController;