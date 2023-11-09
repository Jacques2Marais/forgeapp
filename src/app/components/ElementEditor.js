'use client';

import { useContext, useEffect } from "react";
import { ElementContext } from "./ElementContext";
import { classNameToArray } from "@/lib/element-utils";

export default function ElementEditor({ frameRef = useRef(null) }) {
    // context of current element
    const elementContext = useContext(ElementContext);

    useEffect(() => {
        elementContext.setClasses(elementContext.initialClasses);
    }, [elementContext.initialClasses]);

    function updateClasses(event) {
        const value = event.target.value;
        const classes = classNameToArray(value);
        elementContext.setClasses(classes);

        // post message of class update to iframe
        frameRef.current.contentWindow.postMessage({
            type: 'update-element',
            className: value
        });
    }

    return (
        <div className="editor">
            <form className='editor-form'>
                <div className='input-group'>
                    <label htmlFor="elementClasses">Element's Classes</label>
                    <input placeholder='Classes' id='elementClasses' value={elementContext.classes.join(' ')} onChange={updateClasses} />
                </div>
                <div className='input-group'>
                    <label htmlFor="elementContent">Element's Inner Text</label>
                    <textarea placeholder='Content' id='elementContent'></textarea>
                </div>
                <button type="submit">+ Add Element</button>
            </form>
        </div>
    )
}