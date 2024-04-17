const mysql = require('mysql2');

/* Opening up a connection to the mastermind mysql database */
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    multipleStatements: true
});
connection.connect((err)=>{
    if (err) throw new Error(err);
    console.log('connected')
    connection.query(`CREATE DATABASE IF NOT EXISTS mastermind`, (err) => {
        if(err) throw new Error(err);
        console.log('database created')
        connection.changeUser({database: 'mastermind'}, (err)=>{
            if(err) throw new Error(err);
            console.log('now using mastermind')
            createTables();
        })
    })
})

/* This initiates the tables when the game is first loaded */
async function createTables (){
    pool.query(`CREATE TABLE IF NOT EXISTS gameSettings (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        secretNumber VARCHAR(6) NOT NULL DEFAULT "1234",
        difficulty integer NOT NULL DEFAULT "4",
        attemptNumber integer NOT NULL DEFAULT "0",
        gameStatus VARCHAR(20) NOT NULL DEFAULT "playing"
    );
    
    CREATE TABLE IF NOT EXISTS currentGame (
        attemptId INT PRIMARY KEY AUTO_INCREMENT, 
        guess VARCHAR(6),
        correctLocation integer,
        correctNumber integer
    );`)
    /* Had an issue in setting default values for gameSettings, so created this check function to insert manually */
    const check = await pool.query(`SHOW TABLES LIKE 'gameSettings';`);
    if(!check.rows){
        pool.query(`INSERT INTO gameSettings (secretNumber, difficulty, attemptNumber, gameStatus)
        VALUES (1234, 4, 0, 'playing');`)
    }
}

/* Pool is created, not necessary for this small app but good practice for scaling */
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'mastermind', 
    multipleStatements:true
}).promise();

/* The newGame function accepts one argument which is passed as the new secret number in the database, as well as reset the attempts and game status */
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

/* The changeDifficulty function sends a query to the database to update the amount of digits for the secret number */
async function changeDifficulty(difficulty){
    await pool.query(`UPDATE gameSettings SET difficulty = '${difficulty}' WHERE id = '1'`)
}

/* The addGuessAttempt function sends the data from the current guess attempt to the database to be stored */
async function addGuessAttempt(attempt){
        await pool.query(`UPDATE gameSettings SET attemptNumber = ${attempt.attempt} WHERE id = '1'`)
        await pool.query(`REPLACE INTO currentGame VALUES (${attempt.attempt}, '${attempt.myGuess}', ${attempt.correctLocation}, ${attempt.correctCount})`)    
        if(attempt.gameStatus !== 'playing'){
            await pool.query(`UPDATE gameSettings SET gameStatus = '${attempt.gameStatus}' WHERE id = '1'`)
        };
}

/* When getGameSettingData is called, it makes a query to the database and returns an object with game config information */
async function getGameSettingData(){
    const result = await pool.query('SELECT * FROM gameSettings')
    return result[0][0];
}

/* When getCurrentGameData is called, it makes a query to the database and returns an object with current game attempts information */
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
