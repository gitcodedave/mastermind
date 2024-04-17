import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from 'react';

export default function Board () {

    const [difficulty, setDifficulty] = useState();
    const [guess, setGuess] = useState([]);
    const [attemptRows, setAttempt] = useState([])
    const [gameStatusState, setGameStatusState] = useState('')
    const [incompleteGuessState, setIncompleteGuess] = useState('')
    /* TIME CODE
    const [isRunning, setIsRunning] = useState(true);
    const [time, setTime] = useState(30);
    const [timerModeOn, setTimerMode] = useState(false);
    const timeRef = useRef(null);
    */

    async function handleDifficultyChange (event){
        event.preventDefault();
        const newDifficulty = Number(event.target.value);
        const difficultyChange = await axios.get(`http://localhost:3000/game/changeDifficulty/${newDifficulty}`).then((data) => {
            setDifficulty(newDifficulty)
            return data.data;
        })
        handleNewGameClick();
        clearForms();
    }
    /* TIME CODE
    function handleTimerSelector(event){
        
        const option = event.target.value;
        console.log(option)
        if(option === 'yes'){
            setTimerMode(true);
            setTime(30);
            setIsRunning(true);
        } else {
            setTimerMode(false);
            setTime('');
            setIsRunning(false);
        }
    }
    */
    
    function clearForms (){
        let allForms = document.querySelectorAll('input');
        allForms.forEach(eachInput => eachInput.value = '');
        setGuess([]);
    }
 
    function handleNewGameClick (){

        /* TIME CODE
        setIsRunning(false);
        setTime(30);
        if(timerModeOn === true){
            setTime(30);
        } else{
            setTime('');
        }
        */

        axios.get('http://localhost:3000/game/newGame')
            .then((jsonData) => console.log(`The answer is ${jsonData.data.toString()}`))
        setAttempt([]);
        setGameStatusState('playing');
        clearForms();
    }

    async function handleGuessClick (event){
        /* TIME CODE
        if(isRunning) setTime(30);
        */
        event.preventDefault();
        if(gameStatusState != 'playing') return;
        if(!guess.length) {
            setIncompleteGuess('Enter a number!')
            return;
        }
        if(guess.length != difficulty){
            setIncompleteGuess('Missing digit(s)!')
            return;
        }
        let guessAttempt = guess.join('')
        axios.get(`http://localhost:3000/game/guess/${guessAttempt}`)
        .then((guessAttempted) => {
            axios.get(`http://localhost:3000/game/currentGame`)
            .then((data) => {
                let newAttemptRow = [...attemptRows];
                const currentGameData = data.data.currentGameData;
                const secretNumber = data.data.gameStatus.secretNumber;
                
                const index = newAttemptRow.length;
                    newAttemptRow.push(<tr key={`attempt row ${index+1}`}>
                    <td style={{ textAlign: 'center', border: '1px solid #181818', color: '#ffffff' }}>{index+1}</td>
                    <td style={{ textAlign: 'center', border: '1px solid #181818', color: '#ffffff' }}>{currentGameData[index].guess}</td>
                    <td style={{ textAlign: 'center', border: '1px solid #181818', color: '#ffffff' }}>{currentGameData[index].correctNumber}</td>
                    <td style={{ textAlign: 'center', border: '1px solid #181818', color: '#ffffff' }}>{currentGameData[index].correctLocation}</td>
                    </tr>
                    )
                setAttempt(newAttemptRow);
                if(currentGameData[index].correctLocation === difficulty && currentGameData[index].attemptId <= 10){
                    newAttemptRow.push(<tr key='win row'>
                        <td style={{color: 'green'}}>You won! Start a new game.</td>
                        </tr>
                        )
                    setAttempt(newAttemptRow)
                    setGameStatusState('won')
                } else if (currentGameData[index].attemptId == 10){
                    newAttemptRow.push(<tr key='lose row'>
                        <td style={{color: 'red'}}>You lost! The number was <b>{secretNumber}</b>. Try again.</td>
                        </tr>
                        )
                    setAttempt(newAttemptRow)
                    setGameStatusState('lost')
                }
            })
        })
        
        setIncompleteGuess('')
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
        /* TIME CODE
        if(timerModeOn === true){
            if(isRunning === true){
                timeRef.current = setInterval(()=>{
                    setTime((prevState)=> prevState - 1);
                }, 1000); 
            } else {
                clearInterval(timeRef.current);
            }
        } else {
            clearInterval(timeRef.current);
            setTime('');
        }
        */
        let newAttempt = []
        let gameData;
        axios.get(`http://localhost:3000/game/gameSettings`)
        .then((data) => {
            gameData = data.data;
            setDifficulty(gameData.difficulty);
        })
        axios.get(`http://localhost:3000/game/currentGame`)
        .then((data) => {
            const currentGameData = data.data.currentGameData;
            const gameStatus = data.data.gameStatus.gameStatus;

            /* If this is not a new game */
            if(currentGameData.length){
            for(let i = 0; i < currentGameData.length; i++){
                newAttempt.push(<tr key={`attempt row ${i}`}>
                <td key={`attempt${i}`} style={{ textAlign: 'center', border: '1px solid #181818', color: '#ffffff' }}>{i+1}</td>
                <td key={`guess${i}`} style={{ textAlign: 'center', border: '1px solid #181818', color: '#ffffff' }}>{currentGameData[i].guess}</td>
                <td key={`correct Number${i}`} style={{ textAlign: 'center', border: '1px solid #181818', color: '#ffffff' }}>{currentGameData[i].correctNumber}</td>
                <td key={`correct Location${i}`} style={{ textAlign: 'center', border: '1px solid #181818', color: '#ffffff' }}>{currentGameData[i].correctLocation}</td>
                </tr>
                )
            }
            if(gameStatus == 'won'){
                newAttempt.push(
                    <tr key='win row'>
                    <td style={{color: 'green'}}>You won! Start a new game.</td>
                    </tr>
                )
                setGameStatusState('won')
            } else if(gameStatus == 'lost'){
                newAttempt.push(
                    <tr key='lose row'>
                    <td style={{color: 'red'}}>You lost! The number was <b>{gameData.secretNumber}</b>. Try again.</td>
                    </tr>
                )
                setGameStatusState('lost')
            } 
            
            setAttempt(newAttempt);
        }
        if(gameStatus === 'playing') setGameStatusState('playing');
        /* TIME CODE
        return () => clearInterval(timeRef.current);
        */
        })
    }, [/* TIME CODE: isRunning */]);
    
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
        let stringI = i.toString();
        numberButtons.push(<button style={{ marginLeft: '2px', marginRight: '2px', border: 'none' }} value={stringI} key={stringI} onClick={handleNumberClick(stringI)}>{stringI}</button>);
    }

    return(
        <div>
            <b style={{ color: '#ffffff' }}>MASTERMIND</b>
            <p style={{margin : '0', color: '#aaaaaa'}}>You will have 10 attempts to try and guess a secret number.</p>
            <p style={{margin : '0', color: '#aaaaaa'}}>You can select how many digits you will need to guess. </p>
            <br></br>

            <label style={{ color: '#aaaaaa' }} htmlFor="difficulty">Choose an amount of digits: </label>
            <select style={{ fontFamily: 'inherit' }} onChange={handleDifficultyChange} value={difficulty} name="difficulty" id="difficulty">
                {select}
            </select>

            {/* TIME CODE 
            <p style={{margin : '0'}}>Timer on?</p>
                <div>
                    <input type="radio" onChange={handleTimerSelector} id="yes" name="yesorno" value="yes" />
                    <label htmlFor="yes">Yes</label>
                </div>
                <div>
                    <input type="radio" onChange={handleTimerSelector} defaultChecked id="no" name="yesorno" value="no" />
                    <label htmlFor="no">No</label>
                </div> 
                */}

            <br></br>
            <br></br>
                {<div style={{ position: 'absolute', color: '#ffffff'}}>{guess.join('')}</div>}
            <br></br>
            <br></br>
                {numberButtons}
                    <button style={{ marginLeft: '10px', marginRight: '5px', fontFamily: 'inherit', background: '#F88379', border: 'none' }} onClick={handleNumberDelete}>Delete</button>
                    {/* TIME CODE: {time} */}
                    <button style={{ marginLeft: '10px', fontFamily: 'inherit', background: '#7FFFD4', border: 'none' }} onClick={handleGuessClick}>Guess</button> {<span style={{ color: '#ffffff'}}>{incompleteGuessState}</span>}
            <br></br>
            <br></br>
                <button type="button" style={{ fontFamily: 'inherit', background: '#F8DE7E', border: 'none' }} onClick={handleNewGameClick}>New Game</button>
            <br></br>
            <br></br>
            <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr key='headerrow'>
          <th style={{ color: '#aaaaaa', background: '#3d3d3d', paddingLeft:'10px', paddingRight:'10px', border: '1px solid #181818', }}> Attempt </th>
          <th style={{ color: '#aaaaaa', background: '#3d3d3d', paddingLeft:'10px', paddingRight:'10px', border: '1px solid #181818' }}> Guess </th>
          <th style={{ color: '#aaaaaa', background: '#3d3d3d', paddingLeft:'10px', paddingRight:'10px', border: '1px solid #181818' }}> Numbers Correct </th>
          <th style={{ color: '#aaaaaa', background: '#3d3d3d', paddingLeft:'10px', paddingRight:'10px', border: '1px solid #181818' }}> Location Correct </th>
        </tr>
      </thead>
      <tbody>
        {attemptRows}
      </tbody>
    </table>
        </div>
    )
}