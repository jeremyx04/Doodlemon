import { useEffect, useState, useRef } from 'react';
import { baseURL } from '../utils';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import '../App.css';
import { canvasHeight, canvasWidth } from '../utils';
import { Timer } from '../Components/Timer';
import { useGameContext } from '../context';

export const Draw = () => {
    const [ mousePos, setMousePos ] = useState({x:0,y:0});
    const [ canvasContext, setCanvasContext ] = useState(null);
    const [ brushType, setBrushType ] = useState('draw');
    const gameContext = useGameContext();
    const referenceImage = gameContext.referenceImage;
    const setDrawingImage = gameContext.setDrawingImage;
    const setGameState = gameContext.setGameState;
    const setSimilarity = gameContext.setSimilarity;

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        setCanvasContext(ctx);
    }, [canvasRef]);

    const computeRelativePos = (oldx, oldy) => {
        if(canvasRef.current){
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                x : oldx - rect.left,
                y : oldy - rect.top
            }
        }
    };

    const setPos = (e) => {
        const npos = computeRelativePos(e.clientX,e.clientY);
        setMousePos({
            x:npos.x, y:npos.y
        });
    };

    const draw = (e, ctx) => {
        if(e.buttons !== 1) return;
        const npos = computeRelativePos(e.clientX,e.clientY);
        ctx.beginPath();
        ctx.moveTo(mousePos.x,mousePos.y);
        let nx = npos.x, ny = npos.y;
        setMousePos({
            x:nx,y:ny
        });
        ctx.lineTo(nx,ny);
        ctx.lineCap = "round";
        ctx.stroke();
    }

    const handleMouseMove = (e) => {
        const ctx = canvasContext;
        if(!ctx)
            return;
        if(brushType === 'draw'){
            setPos(e); 
            ctx.globalCompositeOperation="source-over";
            ctx.lineWidth = 2;
            draw(e, ctx);
        }
        else{
            setPos(e);
            ctx.globalCompositeOperation="destination-out";
            ctx.lineWidth = 10;
            draw(e, ctx);
        }
    }

    const changeBrushType = () => {
        if(brushType === 'draw'){
            setBrushType('erase');
        }
        else if(brushType === 'erase'){
            setBrushType('draw');
        }
    }

    const saveCanvasAsPNG = async () => {
        if(!canvasRef.current){
            return;
        }
        const canvas = canvasRef.current;
        const headers = {'Content-Type':'application/json',
        'Access-Control-Allow-Methods':'GET,HEAD,POST,PATCH,OPTIONS',
        'Access-Control-Allow-Headers':
         'Origin, X-Requested-With, Content-Type, Accept, Authorization'}
        const drawing_url = canvas.toDataURL('image/png');
        setDrawingImage(drawing_url);
        try{
            const res = await axios.post(`${baseURL}/submitImage`, {
                headers: headers,
                body: {
                    drawing_url: drawing_url,
                    reference_url: referenceImage,
                },
            });
            setSimilarity(res.data.similarity);
            setGameState('results');
        } catch (err){
            console.error(err);
        }
    };
    
    return (
        <>
            <canvas 
                width={canvasWidth} 
                height={canvasHeight} 
                className="canvas"
                ref={canvasRef}
                onMouseEnter={(e) => setPos(e)}
                onMouseDown={(e) => setPos(e)}
                onMouseMove={handleMouseMove}
                />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <button style={{width:'100px',height:'100px'}} onClick={changeBrushType}>
                        <FontAwesomeIcon icon={faEraser} size='lg'/>
                    </button>
                    <button style={{width:'100px',height:'100px'}} onClick={saveCanvasAsPNG}>
                        Submit
                    </button>
                </div>
                <Timer onTimerFinish={saveCanvasAsPNG} numSeconds={30}/>
        </>
    );  
}

export default Draw;
