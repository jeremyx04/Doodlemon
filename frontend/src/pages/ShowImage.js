import { useGameContext } from '../context'
import { Timer } from '../Components/Timer';
import '../App.css';

export const ShowImage = () => {   
    const gameContext = useGameContext();
    const setGameState = gameContext.setGameState;
    
    const handleTimerFinish = () => {
        setGameState('draw');
    }
    return(
        <div className='show-image-container'>
            <div className='show-image'>
                <img src={gameContext.referenceImage} width='420' height='420' alt={gameContext.referenceImage}/>
            </div>
            <Timer onTimerFinish={handleTimerFinish} numSeconds={10}/>
        </div>
    )
}