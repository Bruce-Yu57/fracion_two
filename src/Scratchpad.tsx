
import React, { useRef, useEffect, useState, useCallback } from 'react';

const Scratchpad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#334155'); // slate-700

  const getContext = useCallback(() => canvasRef.current?.getContext('2d'), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    const applyContextStyles = (ctx: CanvasRenderingContext2D) => {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
    };

    const resizeCanvas = () => {
      const ctx = getContext();
      if (!ctx) return;
      
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      const newWidth = Math.round(width * dpr);
      const newHeight = Math.round(height * dpr);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        // Create a temporary canvas to hold the current drawing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          // Copy the drawing
          tempCtx.drawImage(canvas, 0, 0);
        }

        // Resize the main canvas
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Scale for high DPR screens
        ctx.scale(dpr, dpr);
        
        // Restore the drawing
        if (tempCtx) {
          // Draw the old content back, scaling it to the new CSS size
          ctx.drawImage(tempCanvas, 0, 0, width, height);
        }
      }
      // Re-apply styles because resizing resets the context
      applyContextStyles(ctx);
    };

    const observer = new ResizeObserver(() => {
      // Decouple the resize logic from the observer's callback via rAF
      // to prevent the "loop completed" error.
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(resizeCanvas);
    });

    observer.observe(canvas);
    
    // Initial resize
    resizeCanvas();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [getContext, color]);

  const getCoords = (event: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    const clientX = 'touches' in event.nativeEvent ? event.nativeEvent.touches[0].clientX : event.nativeEvent.clientX;
    const clientY = 'touches' in event.nativeEvent ? event.nativeEvent.touches[0].clientY : event.nativeEvent.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const context = getContext();
    if (context) {
      const { x, y } = getCoords(event);
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;
    const context = getContext();
    if (context) {
      const { x, y } = getCoords(event);
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    const context = getContext();
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = getContext();
    if (canvas && context) {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
    }
  };
  
  const colors = [
      { name: 'Black', value: '#334155' },
      { name: 'Red', value: '#ef4444' },
      { name: 'Blue', value: '#3b82f6' },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-slate-200">
      <div className="flex items-center justify-between p-2 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700">草稿區</h3>
        <div className="flex items-center space-x-2">
           {colors.map(c => (
             <button
                key={c.name}
                onClick={() => setColor(c.value)}
                className={`w-6 h-6 rounded-full transition-transform transform ${color === c.value ? 'scale-110 ring-2 ring-offset-1 ring-indigo-500' : ''}`}
                style={{ backgroundColor: c.value }}
                aria-label={`Select ${c.name} color`}
            />
           ))}
          <button onClick={clearCanvas} className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition">
            清除
          </button>
        </div>
      </div>
      <div className="flex-grow w-full h-full p-1 relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full touch-none"
            style={{ display: 'block' }}
          />
      </div>
    </div>
  );
};

export default Scratchpad;