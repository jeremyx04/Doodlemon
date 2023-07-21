import './App.css';
import { Home } from './pages/Home';
import { ShowImage } from './pages/ShowImage';
import { useGameContext } from './context';
import { Draw } from './pages/Draw';
import { Results } from './pages/Results';

const App = () => {
  const gameContext = useGameContext();
  return (
    <div className="app">
        {(() => {
          switch (gameContext.gameState) {
            case 'home': {
              return <Home />;
            }
            case 'showImage': {
              return <ShowImage />
            }
            case 'draw': {
              return <Draw />;
            }
            case 'results': {
              return <Results />;
            }
            default: {
              return null;
            }
          }
        })()}
    </div>
  );
}

export default App;
    