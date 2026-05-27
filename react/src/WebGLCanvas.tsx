import React, { useEffect, useRef, useState } from 'react';
import Experience from "./threejs/Experience/Experience";
import './WebGLCanvas.css';
export default function WebGLCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const experience = new Experience(canvasRef.current);

        return () => {
            experience.destroy?.();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="webgl"
        />
    );
}