import React, { useState, useContext, createContext } from 'react'

const GameContext = createContext({
    gameState: 'home',
    setGameState: () => null,
    referenceImage: '',
    setReferenceImage: () => null,
    drawingImage: '',
    setDrawingImage: () => null,
    similarity: 0,
    setSimilarity: () => null,
});

export const GameContextProvider = ({ children }) => {
    const [gameState, setGameState] = useState('home');
    const [referenceImage, setReferenceImage] = useState('');
    const [drawingImage, setDrawingImage] = useState('');
    const [similarity, setSimilarity] = useState(0);
    return (
        <GameContext.Provider value={{gameState, setGameState, referenceImage, setReferenceImage, drawingImage, setDrawingImage, similarity, setSimilarity}}>
            {children}
        </GameContext.Provider>
    )
}

export const useGameContext = () => useContext(GameContext);