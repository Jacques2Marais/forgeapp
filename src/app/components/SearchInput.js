'use client';

import { useEffect, useRef, useState } from "react";
import Fuse from 'fuse.js'

export default function SearchInput({ items }) {
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    let [results, setResults] = useState(items);
    let [list, setList] = useState([]);
    let [visible, setVisible] = useState(false);

    // on result click event
    function resultChoose(event) {
        event.preventDefault();
        const result = event.target.dataset.result;

        inputRef.current.value = result;

        setVisible(false);
    }

    // update ul contents on new results
    useEffect(() => {
        setList(results.map((result, index) => 
            <button key={index} data-result={result}>{result}</button>
        ));
    }, [results]);

    // setup Fuse for fuzzy search
    const fuse = new Fuse(items);

    // execute search on input
    function search() {
        const value = inputRef.current.value;

        // fuzzy search using Fuse
        const fuseResults = fuse.search(value);

        // if field non-empty, search, else show all items
        if (value.length) {
            setResults(fuseResults.map((fuseResult) => fuseResult.item));
        } else {
            setResults(items);
        }
    }

    function hideResults(event) {
        if (!resultsRef.current.contains(event.relatedTarget)) {
            setVisible(false);
        }
    }

    return (
        <div className="search-input">
            <input 
                ref={inputRef} 
                onInput={search} 
                onFocus={() => setVisible(true)} 
                onBlur={hideResults}
            />
            <div className="search-results" ref={resultsRef} onClick={resultChoose} style={{ display: visible ? 'flex': 'none' }}>
                {list}
            </div>
        </div>
    )
}