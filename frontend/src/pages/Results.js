import '../App.css';
import { useGameContext } from '../context';

export const Results = () => {
    const gameContext = useGameContext();
    const referenceImage = gameContext.referenceImage;
    const drawingImage = gameContext.drawingImage;
    const similarity = gameContext.similarity;
    return(
        <div className='home-container'>
            <div className='title'>
                doodlemon
            </div>
            <div className='show-results'>
                <div className='show-results-image'>
                    <img src={referenceImage} width='420' height='420' alt={referenceImage}/>
                    Reference Image
                </div>
                <div className='show-results-image'>
                    <img src={drawingImage} width='420' height='420'alt={drawingImage}/>
                    Your Drawing
                </div>
            </div>
            <div style={{paddingTop: 50}}>
                They were {Math.round(similarity * 1000) / 10} % similar!
            </div>
        </div>
    )
}