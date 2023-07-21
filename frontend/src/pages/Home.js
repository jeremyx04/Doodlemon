import axios from 'axios';
import '../App.css';
import { pokemonURL } from '../utils';
import { useGameContext } from '../context';

export const Home = () => {
    const gameContext = useGameContext();
    const setGameState = gameContext.setGameState;
    const setReferenceImage = gameContext.setReferenceImage;
    const handleClickPlay = async () => {
        const id = Math.floor(Math.random() * 1010) + 1
        try{
            const res = await axios.get(`${pokemonURL}/pokemon/${id}`);
            const pokemonData = res.data;
            const imageURL = pokemonData.sprites.other['official-artwork'].front_default;
            setGameState('showImage');
            setReferenceImage(imageURL);
        }   
        catch (err) {
            console.error(err);
        }
    }
    return(
        <div className='home-container'>
            <div className='title'>
                doodlemon
            </div>
            <button className='play-button' onClick={handleClickPlay}>
                Play
            </button>
        </div>
    )
}