import { useEffect, useState, useRef } from 'react';

const Canvas = ({width,height}) => {
    const [mousePos, setMousePos] = useState({x:0,y:0});
    const [canvasContext, setCanvasContext] = useState(null);

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
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

    const Draw = (e) => {
        if(e.buttons !== 1) return;
        const ctx = canvasContext;
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

    return (
        <canvas 
            width={width} 
            height={height} 
            style={canvasStyle}
            ref={canvasRef}
            onMouseEnter={(e) => setPos(e)}
            onMouseDown={(e) => setPos(e)}
            onMouseMove={(e) => {setPos(e); 
                                Draw(e)}}
            />
    );  
}

export default Canvas;

const canvasStyle = {
    border: "1px solid black"
}