'use client';

import { useRef } from 'react'
import ElementComposer from './components/ElementComposer';
import ElementEditor from './components/ElementEditor';

export default function Home() {
    const frameRef = useRef(null);

    return (
        <main className='flex'>
            <div className='w-1/5'>
                <ElementComposer frameRef={frameRef} />
            </div>
            <div className='flex-grow'>
                <iframe src="/frame" ref={frameRef} />
            </div>
            <div className='w-1/5'>
                <ElementEditor frameRef={frameRef} />
            </div>
        </main>
    )
}