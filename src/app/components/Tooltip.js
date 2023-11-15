'use client';

import { useEffect, useState } from "react";

export default function Tooltip({ position, visible, children }) {
    const [orientationStyle, setOrientationStyle] = useState({ left: `${position.x}px` });
    
    useEffect(() => {
        if (position.x > window.screen.width / 2) {
            setOrientationStyle({ right: `${window.screen.width - position.x}px` });
        } else {
            setOrientationStyle({ left: `${position.x}px` });
        }

        console.log(window.screen.width - position.x);
    }, [position]);

    return (
        <div className="tooltip" style={{...orientationStyle, top: `${position.y}px`, display: visible ? 'block': 'none'}}>
            {children}
        </div>
    );
}

export const TOOLTIP_LEFT = 0;
export const TOOLTIP_RIGHT = 1;