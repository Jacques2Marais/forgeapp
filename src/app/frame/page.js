'use client';

import logic from '@/lib/logic';
import { useEffect, useRef } from 'react';

export default function Frame() {
    let rootElement = useRef(null);
    let currentElement = useRef(null);

    // start listening for postMessage messages on initial render
    useEffect(() => {
        currentElement.current = rootElement.current;

        // callback for "message" event
        function onMessage(event) {
            // process message from parent window
            currentElement.current = logic(currentElement.current, event.data, rootElement.current);
        }

        // listener for "message" event
        window.addEventListener("message", onMessage);

        // clean-up
        return () => {
            window.removeEventListener("message", onMessage);
        }
    }, []);


    return (
        <>
            <script src="https://cdn.tailwindcss.com"></script>
            <main ref={rootElement}>

            </main>
        </>
    )
}