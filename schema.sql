CREATE DATABASE mastermind;
USE mastermind;

CREATE TABLE secret (
	id INT PRIMARY KEY AUTO_INCREMENT,
	secretNumber VARCHAR(4)
);
INSERT INTO secret (secretNumber) VALUES ("1234");

CREATE TABLE user (
    id integer PRIMARY KEY AUTO_INCREMENT
);
