'use client';

import { createContext, useState } from 'react';

export const ElementContext = createContext({
    editorClasses: [],
    setEditorClasses: () => { },

    composerClasses: [],
    setComposerClasses: () => { }
});


export function ElementContextProvider({ children }) {
    const [editorClasses, setEditorClasses] = useState([]);
    const [composerClasses, setComposerClasses] = useState([]);
    const value = { editorClasses, setEditorClasses, composerClasses, setComposerClasses };

    return (
        <ElementContext.Provider value={value}>
            {children}
        </ElementContext.Provider>
    )
}