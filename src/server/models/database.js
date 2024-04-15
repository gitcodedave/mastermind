const mysql = require('mysql2');

/* Opening up a connection to the mastermind mysql database */
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'mastermind'
}).promise();

/* The newGame function accepts one parameter which is passed as the new secret number in the database */
async function newGame(newNum){
    await pool.query(`UPDATE gameSettings SET secretNumber = '${newNum}' WHERE id = '1'`)
    await pool.query(`UPDATE gameSettings SET attemptNumber = '0' WHERE id = '1'`)
    await pool.query(`UPDATE gameSettings SET gameStatus = 'playing' WHERE id = '1'`)
    await pool.query(`DROP TABLE currentGame`)
    await pool.query(
        `CREATE TABLE currentGame (
        attemptId INT PRIMARY KEY AUTO_INCREMENT, 
        guess VARCHAR(6),
        correctLocation integer,
        correctNumber integer
        );`
    )
}

async function changeDifficulty(difficulty){
    await pool.query(`UPDATE gameSettings SET difficulty = '${difficulty}' WHERE id = '1'`)
}

async function addGuessAttempt(attempt){
        await pool.query(`UPDATE gameSettings SET attemptNumber = ${attempt.attempt} WHERE id = '1'`)
        await pool.query(`REPLACE INTO currentGame VALUES (${attempt.attempt}, ${attempt.myGuess}, ${attempt.correctLocation}, ${attempt.correctCount})`)    
        if(attempt.gameStatus !== 'playing'){
            await pool.query(`UPDATE gameSettings SET gameStatus = '${attempt.gameStatus}' WHERE id = '1'`)
        };
}

/* When getGameSettingData is called, it makes a query to the database and returns an object with static game information */
async function getGameSettingData(){
    const result = await pool.query('SELECT * FROM gameSettings')
    return result[0][0];
}

/* When getCurrentGameData is called, it makes a query to the database and returns an object with current dynamic game information */
async function getCurrentGameData(){
    const result = await pool.query('SELECT * FROM currentGame')
    return result[0];
}



module.exports = {
    getGameSettingData,
    getCurrentGameData,
    addGuessAttempt,
    changeDifficulty,
    newGame
}
