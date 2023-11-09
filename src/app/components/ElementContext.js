'use client';

import { createContext, useState } from 'react';

export const ElementContext = createContext({
    classes: [],
    setClasses: () => { },

    initialClasses: [],
    setInitialClasses: () => { }
});


export function ElementContextProvider({ children }) {
    const [classes, setClasses] = useState([]);
    const [initialClasses, setInitialClasses] = useState([]);
    const value = { classes, setClasses, initialClasses, setInitialClasses };

    return (
        <ElementContext.Provider value={value}>
            {children}
        </ElementContext.Provider>
    )
}