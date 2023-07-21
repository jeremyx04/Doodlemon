import React, { useState, useContext, createContext } from 'react'

const GameContext = createContext({
    gameState: 'home',
    setGameState: () => null,
    referenceImage: '',
    setReferenceImage: () => null,
    drawingImage: '',
    setDrawingImage: () => null,
});

export const GameContextProvider = ({ children }) => {
    const [gameState, setGameState] = useState('home');
    const [referenceImage, setReferenceImage] = useState('');
    const [drawingImage, setDrawingImage] = useState('');
    return (
        <GameContext.Provider value={{gameState, setGameState, referenceImage, setReferenceImage, drawingImage, setDrawingImage}}>
            {children}
        </GameContext.Provider>
    )
}

export const useGameContext = () => useContext(GameContext);