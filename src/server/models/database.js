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
    await pool.query(`UPDATE secret SET secretNumber = '${newNum}' WHERE id = '1'`)
}

/* When getNumber is called, it makes a query to the database for the current secret number */
async function getNumber(){
    const result = await pool.query('SELECT * FROM secret')
    return result[0][0].secretNumber.toString();
}

module.exports = {
    getNumber,
    newGame
}
