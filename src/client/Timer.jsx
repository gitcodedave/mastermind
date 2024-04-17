import React from "react";
import { useState, useEffect } from 'react';

export default function Timer ({maxRange}) {
    const [timer, setTimer] = useState(maxRange);

    useEffect(()=>{
        if (timer > 0){
            setInterval(() => {
                setTimer(timer - 1)
            }, 1000)
        } 
    },[timer])

    return (
        <span>{timer}</span>
        
    )
}