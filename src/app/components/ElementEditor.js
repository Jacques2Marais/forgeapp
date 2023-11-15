'use client';

import { useContext, useEffect, useRef, useState } from "react";
import { ElementContext } from "./ElementContext";
import { classNameToArray } from "@/lib/utils";
import SearchInput from "./SearchInput";
import { tw, twRules } from "@/lib/db";
import Tooltip from "./Tooltip";
import ClassInput from "./ClassInput";

export default function ElementEditor({ frameRef = useRef(null) }) {
    // context of current element
    const elementContext = useContext(ElementContext);

    useEffect(() => {
        elementContext.setEditorClasses(elementContext.composerClasses);
    }, [elementContext.composerClasses]);

    function updateClasses(event) {
        const value = event.target.value;
        const classes = classNameToArray(value);
        elementContext.setEditorClasses(classes);

        // post message of class update to iframe
        frameRef.current.contentWindow.postMessage({
            type: 'update-element',
            className: value
        });
    }

    // start listening for postMessage messages from iframe on initial render
    useEffect(() => {
        // callback for "message" event
        function onMessage(event) {
            if (event.data.type === 'broadcast-element-info') {
                const classes = classNameToArray(event.data.className);
                elementContext.setEditorClasses(classes);
            }
        }

        // listener for "message" event
        window.addEventListener("message", onMessage);

        // clean-up
        return () => {
            window.removeEventListener("message", onMessage);
        }
    }, []);

    const elementClassInput = useRef(null);

    const [twPopupPosition, setTwPopupPosition] = useState({x: 0, y: 0});
    const [twPopupVisible, setTwPopupVisible] = useState(false);
    const [twPopupContent, setTwPopupContent] = useState('');

    function classMouseEnter(event, item) {
        const rect = event.target.getBoundingClientRect();

        setTwPopupPosition({
            x: event.clientX + 8,
            y: rect.top + event.target.offsetHeight
        });
        setTwPopupContent(twRules[item.refIndex].replace(/\:/g, ": "));
        setTwPopupVisible(true);
    }

    function classMouseLeave() {
        setTwPopupVisible(false);
    }

    return (
        <div className="editor">
            <form className='editor-form'>
                <div className='input-group'>
                    <label htmlFor="editorClasses">Element's Classes</label>
                    <ClassInput 
                        onChange={updateClasses} 
                        value={elementContext.editorClasses.join(' ')}
                        id='editorClasses' />
                    {/* <SearchInput 
                        items={tw} delimiter=' '
                        value={elementContext.editorClasses.join(' ')} onChange={updateClasses}
                        placeholder='Classes' id='elementClasses' ref={elementClassInput}
                        onResultMouseEnter={classMouseEnter}
                        onResultMouseLeave={classMouseLeave} />
                    <Tooltip visible={twPopupVisible} x={twPopupPosition.x} y={twPopupPosition.y}>
                        {twPopupContent.split(';').map((rule, index) => {
                            return (<span className='block' key={index}>{rule}</span>)
                        })}
                    </Tooltip> */}
                    {/* <input placeholder='Classes' id='elementClasses' value={elementContext.editorClasses.join(' ')} onChange={updateClasses} /> */}
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