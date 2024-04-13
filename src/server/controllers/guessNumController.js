const db = require('../models/database.js')

const guessNumController = {};

guessNumController.guess = async (req, res, next) => {
    /* Constants are created to store the client's guess, as well as the secret number to compare with */
    const inputGuess = req.params.guess.split('');
    const answer = await db.getNumber();
    const inputGuessCache = req.params.guess.split('');
    const answerCache = answer.toString().split('');

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
        answer: answer.toString(),
        myGuess: inputGuess.join(''),
        correctCount: correctCount,
        correctLocation: correctLocation
    }
    next();
}

module.exports = guessNumController;