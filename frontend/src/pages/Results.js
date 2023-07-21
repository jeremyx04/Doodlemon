import '../App.css';
import { useGameContext } from '../context';

export const Results = () => {
    const gameContext = useGameContext();
    const referenceImage = gameContext.referenceImage;
    const drawingImage = gameContext.drawingImage;
    return(
        <div className='home-container'>
            <div className='title'>
                doodlemon
            </div>
            <div className='show-results'>
                <div className='show-results-image'>
                    <img src={referenceImage} width='420' height='420' alt={referenceImage}/>
                    The reference image
                </div>
                <div className='show-results-image'>
                    <img src={drawingImage} width='420' height='420'alt={drawingImage}/>
                    Your drawing
                </div>
            </div>
        </div>
    )
}