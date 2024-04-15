import React from "react";
import axios from "axios";
import react, { useState, useEffect } from 'react';

export default function Board () {
    const [difficulty, setDifficulty] = useState();
    const [guess, setGuess] = useState([]);
    const [attemptRows, setAttempt] = useState([])
    const [gameStatusState, setGameStatusState] = useState('')
    /* Need to setup UseEffect to set game state */
    let attemptState = '';
    
    async function handleDifficultyChange (event){
        event.preventDefault();
        const newDifficulty = Number(event.target.value);
        const difficultyChange = await axios.get(`http://localhost:3000/game/changeDifficulty/${newDifficulty}`).then((data) => {
            console.log(`Amount of numbers to guess is now ${data.data}`)
            setDifficulty(newDifficulty)
            return data.data;
        })
        handleNewGameClick();
        clearForms();
    }

    function clearForms (){
        let allForms = document.querySelectorAll('input');
        allForms.forEach(eachInput => eachInput.value = '');
        setGuess([]);
    }

    function handleNewGameClick (){
        axios.get('http://localhost:3000/game/newGame')
            .then((jsonData) => console.log(`The answer is ${jsonData.data.toString()}`))
        setAttempt([]);
        setGameStatusState('playing');
        clearForms();
    }
    async function handleGuessClick (event){
        event.preventDefault();
        if(gameStatusState !== 'playing') return;
        if(!guess.length) return;
        
        let guessAttempt = guess.join('')
        axios.get(`http://localhost:3000/game/guess/${guessAttempt}`)
        .then((guessAttempted) => {
            axios.get(`http://localhost:3000/game/currentGame`)
            .then((data) => {
                let newAttemptRow = [...attemptRows];
                const currentGameData = data.data.currentGameData;
                const index = newAttemptRow.length;
                    newAttemptRow.push(<tr key={`attempt row ${index+1}`}>
                    <td style={{ border: '1px solid #616D7E' }}>{index+1}</td>
                    <td style={{ border: '1px solid #616D7E' }}>{currentGameData[index].guess}</td>
                    <td style={{ border: '1px solid #616D7E' }}>{currentGameData[index].correctNumber}</td>
                    <td style={{ border: '1px solid #616D7E' }}>{currentGameData[index].correctLocation}</td>
                    </tr>
                    )
                setAttempt(newAttemptRow);
                if(currentGameData[index].correctLocation === difficulty && currentGameData[index].attemptId <= 10){
                    newAttemptRow.push(<tr key='win row'>
                        <td>You won! Start a new game.</td>
                        </tr>
                        )
                    setAttempt(newAttemptRow)
                    setGameStatusState('won')
                } else if (currentGameData[index].attemptId == 10){
                    newAttemptRow.push(<tr key='lose row'>
                        <td>You lost! Try again.</td>
                        </tr>
                        )
                    setAttempt(newAttemptRow)
                    setGameStatusState('lost')
                }
            })
        })
    
        clearForms();
    }
    
    const handleNumberClick = value => () => {
        const newGuess = [...guess];
        if(newGuess.length === difficulty) return;
        newGuess.push(value);
        setGuess(newGuess);
    }
    function handleNumberDelete (){
        const newGuess = [...guess];
        newGuess.pop();
        setGuess(newGuess);
    }
    
    /* The useEffect in this section will bring the state back to the most recent version */
    useEffect(() => {
        let newAttempt = []
        axios.get(`http://localhost:3000/game/gameSettings`)
        .then((data) => {
            const gameData = data.data;
            setDifficulty(gameData.difficulty);
            attemptState = gameData.attemptNumber;
        })
        axios.get(`http://localhost:3000/game/currentGame`)
        .then((data) => {
            const currentGameData = data.data.currentGameData;
            const gameStatus = data.data.gameStatus;

            /* If this is not a new game */
            if(currentGameData.length){
            for(let i = 0; i < currentGameData.length; i++){
                newAttempt.push(<tr key={`attempt row ${i}`}>
                <td key={`attempt${i}`} style={{ border: '1px solid #616D7E' }}>{i+1}</td>
                <td key={`guess${i}`} style={{ border: '1px solid #616D7E' }}>{currentGameData[i].guess}</td>
                <td key={`correct Number${i}`} style={{ border: '1px solid #616D7E' }}>{currentGameData[i].correctNumber}</td>
                <td key={`correct Location${i}`} style={{ border: '1px solid #616D7E' }}>{currentGameData[i].correctLocation}</td>
                </tr>
                )
            }
            if(gameStatus == 'won'){
                newAttempt.push(
                    <tr key='win row'>
                    <td>You won! Start a new game.</td>
                    </tr>
                )
                setGameStatusState('won')
            } else if(gameStatus == 'lost'){
                newAttempt.push(
                    <tr key='lose row'>
                    <td>You lost! Try again.</td>
                    </tr>
                )
                setGameStatusState('lost')
            } else {
                setGameStatusState('playing')
             }
            setAttempt(newAttempt);
            }
        })
      }, []);
    
    /* This creates the options to select a difficulty */
    let select = [];
    if(difficulty){
        let remainingOptions = [4, 5, 6].filter((num)=> num !== difficulty);
        select.push(<option value={difficulty} key={`difficulty${difficulty}`}>{difficulty}</option>)
        for(let num of remainingOptions){
            select.push(<option value={num} key={num}>{num}</option>);
        }
    }
    /* This creates the clickable buttons to guess with 0 - 7 */
    let numberButtons = [];
    for(let i = 0; i < 8; i++){
        numberButtons.push(<button value={i} key={i} onClick={handleNumberClick(i)}>{i}</button>);
    }



    return(
        <div>    
            <label htmlFor="difficulty">Choose amount of numbers to guess:</label>
            <select onChange={handleDifficultyChange} value={difficulty} name="difficulty" id="difficulty">
                {select}
            </select>
            <br></br>
                {guess.join('')}
            <br></br>
                {numberButtons}
                    <button onClick={handleGuessClick}>Guess</button>
                    <button onClick={handleNumberDelete}>Delete</button>
            <br></br>
            <br></br>
                <button type="button" onClick={handleNewGameClick}>New Game</button>
            <br></br>
            <br></br>
            <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr key='headerrow'>
          <th style={{ border: '1px solid #616D7E' }}>Attempt</th>
          <th style={{ border: '1px solid #616D7E' }}>Guess</th>
          <th style={{ border: '1px solid #616D7E' }}>Numbers Correct</th>
          <th style={{ border: '1px solid #616D7E' }}>Location Correct</th>
        </tr>
      </thead>
      <tbody>
        {attemptRows}
      </tbody>
    </table>
        </div>
    )
}