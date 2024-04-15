const db = require('../models/database.js')

const gameController = {};

gameController.getGameSettings = async (req, res, next) => {
    const gameSettings = await db.getGameSettingData();
    res.locals.gameSettings = gameSettings;
    next();
}

gameController.getCurrentGameData = async (req, res, next) => {
    const currentGameData = await db.getCurrentGameData();
    const gameSettings = await db.getGameSettingData();
    res.locals.currentGameData = currentGameData;
    res.locals.gameStatus = gameSettings.gameStatus;
    next();
}

gameController.startNewGame = async(req, res, next) => {
    const gameData = await db.getGameSettingData();
    const difficulty = gameData.difficulty;
    /* API is called and returns a JSON object, converted to plain text */
    const randomNums = await fetch(`https://www.random.org/integers/?num=${difficulty}&min=0&max=7&col=4&base=10&format=plain&rnd=new`)
        .then((data) => data.text());

    /* The API response data is normalized and then passed as an argument into the db.newGame method */
    await db.newGame(randomNums.replace(/\s/g, ''));
    res.locals.randomNums = randomNums.replace(/\s/g, '');
    next();
}

gameController.changeDifficulty = async(req, res, next) => {
    let difficulty = req.params.difficulty;
    await db.changeDifficulty(difficulty);
    res.locals.difficulty = difficulty;
    next();
}

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
    await db.addGuessAttempt(res.locals.data)
    const currentGameData = await db.getCurrentGameData();
    next();
    } 
    
    else {
        res.locals.data = {};
        res.locals.data.gameStatus = gameSettings.gameStatus;
        next();
    }
}

module.exports = gameController;