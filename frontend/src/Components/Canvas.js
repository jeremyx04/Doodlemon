import { useEffect, useState, useRef } from 'react';
import { baseURL } from '../utils';
import axios from 'axios';

const Canvas = ({width,height}) => {
    const [ mousePos, setMousePos ] = useState({x:0,y:0});
    const [ canvasContext, setCanvasContext ] = useState(null);
    const [ brushType, setBrushType ] = useState('draw');

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        setCanvasContext(ctx);
    }, [canvasRef, height, width]);

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

    const Draw = (e, ctx) => {
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
        if(brushType === 'draw'){
            setPos(e); 
            ctx.strokeStyle = `rgb(0,0,0)`;
            ctx.lineWidth = 2;
            Draw(e, ctx);
        }
        else{
            setPos(e);
            ctx.strokeStyle = `rgb(245,243,241)`;
            ctx.lineWidth = 10;
            Draw(e, ctx);
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
        const imgURL = canvas.toDataURL('image/png',0.5);
        console.log(imgURL);
        const headers = {'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'http://localhost:3000',
                    'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'}
        const res = await axios.post(`${baseURL}/submitImage`, {
            headers: headers,
            body: {
                url: imgURL,
            },
        });
        console.log(res);
    };
    
    return (
        <>
            <canvas 
                width={width} 
                height={height} 
                style={canvasStyle}
                ref={canvasRef}
                onMouseEnter={(e) => setPos(e)}
                onMouseDown={(e) => setPos(e)}
                onMouseMove={handleMouseMove}
                />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <button style={{width:'100px',height:'100px'}} onClick={changeBrushType}/>
                    <button style={{width:'100px',height:'100px'}} onClick={saveCanvasAsPNG}/>
                </div>
        </>
    );  
}

export default Canvas;

const canvasStyle = {
    border: "1px solid black"
}