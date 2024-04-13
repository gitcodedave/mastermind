import React from "react";
import axios from "axios";

let guessState = '';

function handleGuessChange (event){
    guessState = event.target.value;
}

function clearForms (){
    let allForms = document.querySelectorAll('input');
    allForms.forEach(eachInput => eachInput.value = '');
}

function handleNewGameClick (){
    const newGameNumber = axios.get('http://localhost:3000/randomNum')
        .then((jsonData) => console.log(`The answer is ${jsonData.data.toString()}`))
    clearForms();
}
function handleGuessClick (event){
    event.preventDefault()
    axios.get(`http://localhost:3000/guessNum/${guessState}`)
    .then((data) => console.log(data.data))

    clearForms();
}

export default function Board () {
    return(
        <div>
            This is the board module
            <form>
                <input placeholder="guess" onChange={handleGuessChange}></input>
                <button onClick={handleGuessClick}>Guess</button>
            </form>
            <button type="button" onClick={handleNewGameClick}>New Game</button>
        </div>
    )
}