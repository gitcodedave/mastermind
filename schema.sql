CREATE DATABASE mastermind;
USE mastermind;

CREATE TABLE gameSettings (
	id INT PRIMARY KEY AUTO_INCREMENT,
	secretNumber VARCHAR(6) DEFAULT '1234',
    difficulty integer DEFAULT '4',
    attemptNumber integer DEFAULT '0',
    gameStatus VARCHAR(20) DEFAULT 'playing'
);

CREATE TABLE currentGame (
    attemptId INT PRIMARY KEY AUTO_INCREMENT, 
    guess VARCHAR(6),
    correctLocation integer,
    correctNumber integer
);

INSERT INTO gameSettings (secretNumber, difficulty, attemptNumber, gameStatus)
VALUES (1234, 4, 0, 'playing');
