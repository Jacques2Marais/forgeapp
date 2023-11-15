'use client';

import { tw, twRules } from "@/lib/db";
import { forwardRef, useRef, useState } from "react";
import Tooltip, { TOOLTIP_LEFT, TOOLTIP_RIGHT } from "./Tooltip";
import SearchInput from "./SearchInput";
import { beautifyCss } from "@/lib/utils";

const ClassInput = forwardRef(function ClassInput({ value = null, id = '', placeholder = 'Classes', onChange = () => {} }, inputRef = null) {
    if (inputRef === null) {
        inputRef = useRef(null);
    }

    const [twPopupPosition, setTwPopupPosition] = useState({x: 0, y: 0});
    const [twPopupVisible, setTwPopupVisible] = useState(false);
    const [twPopupContent, setTwPopupContent] = useState('');

    function classMouseEnter(event, item) {
        const rect = event.target.getBoundingClientRect();

        setTwPopupPosition({
            x: event.clientX,
            y: rect.top + event.target.offsetHeight
        });
        setTwPopupContent(getOnlyCssRules(twRules[item.refIndex]).replace(/\:/g, ": "));
        setTwPopupVisible(true);
    }

    function classMouseLeave() {
        setTwPopupVisible(false);
    }

    function getOnlyCssRules(css) {
        const match = css.match(/{(.*)}/);

        if (match !== null) {
            return match[1];
        }

        return css;
    }

    function formatCssRule(rule) {
        const parts = rule.trim().split(":");

        return (<>
            <span className="css-rule-name">{parts[0]}</span>:
            <span className="css-rule-value">{parts[1]}</span>
        </>);
    }

    return (
        <>
            <SearchInput 
                items={tw} delimiter=' '
                value={value} onChange={onChange}
                placeholder={placeholder} id={id} ref={inputRef}
                onResultMouseEnter={classMouseEnter}
                onResultMouseLeave={classMouseLeave} />
            <Tooltip visible={twPopupVisible} position={twPopupPosition}>
                {twPopupContent.split(';').map((rule, index) => {
                    return (
                        <span className='css-rule' key={index}>{
                            formatCssRule(rule)
                        };</span>
                    )
                })}
            </Tooltip>
        </>
    )
});

export default ClassInput;