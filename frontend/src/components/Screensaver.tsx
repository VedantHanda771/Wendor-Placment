import React, { useEffect, useState, useRef } from "react";
import "./Screensaver.css";

interface IdleScreenProps {
    idleTime?: number; // milliseconds
}

const Screensaver: React.FC<IdleScreenProps> = ({ idleTime = 30000 }) => {
    const [isIdle, setIsIdle] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsIdle(false);
        timeoutRef.current = setTimeout(() => setIsIdle(true), idleTime);
    };

    useEffect(() => {
        const events = ["mousemove", "mousedown", "keypress", "touchstart"];

        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer(); // Start timer on mount

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, []);

    return (
        <>
            {isIdle && (
                <div className="idle-overlay" onClick={() => setIsIdle(false)}>
                    <div className="idle-content">
                        <img src="/logo.png" alt="Logo" className="idle-logo" />
                        <h1 className="idle-text">Touch to Start</h1>
                    </div>
                </div>
            )}
        </>
    );
};

export default Screensaver;
