'use client';

import { forwardRef, useEffect, useRef, useState } from "react";
import Fuse from 'fuse.js'
import { ChevronDown } from "lucide-react";
import { getWordAtPosition } from '@/lib/utils';

const SearchInput = forwardRef(function SearchInput({ items, placeholder = '', id = '', delimiter = '', value = null, allowDuplicates = false, onChange = (event) => {}, onInput = (event) => {}, onResultMouseEnter = () => {}, onResultMouseLeave = () => {} }, inputRef) {
    const resultsRef = useRef(null);
    let [results, setResults] = useState(items);
    let [list, setList] = useState([]);
    let [visible, setVisible] = useState(false);

    let [focusedResult, setFocusedResult] = useState(-1);

    // on result click event
    function clickResult(event) {
        event.preventDefault();
        const result = event.target.dataset.result;

        chooseResult({ name: result });

        setVisible(false);
    }

    // on result selection
    function chooseResult(result) {
        if (typeof result !== 'object' || !result) {
            return;
        }

        if (delimiter.length) {
            const searchValue = inputRef.current.value;
            const position = getWordAtPosition(searchValue, inputRef.current.selectionStart);
            const appendDelimeterAfter = searchValue[position.end] !== delimiter ? delimiter: '';

            inputRef.current.value = searchValue.substring(0, position.start) + result.name + searchValue.substring(position.end) + appendDelimeterAfter;
            inputRef.current.focus();
            inputRef.current.selectionStart = inputRef.current.selectionEnd = position.start + result.name.length + delimiter.length;
        } else {
            inputRef.current.value = result.name;
        }
    }

    // update ul contents on new results
    useEffect(() => {
        setList(results.map((result, index) => 
            <button 
                tabIndex="-1" 
                className={`${focusedResult === index ? 'search-result-focused': ''}`} 
                key={index} 
                data-result={result.name}
                onMouseEnter={(event) => onResultMouseEnter(event, result)}
                onMouseLeave={(event) => onResultMouseLeave(event, result)}
            >
                {result.name}
            </button>
        ));
    }, [results, focusedResult]);

    useEffect(() => {
        setFocusedResult(-1);
    }, [visible]);

    // setup Fuse for fuzzy search
    const fuse = new Fuse(items);

    // execute search on input
    function search(event = null) {
        if (event !== null) {
            // execute initially provided onChange event
            onChange(event);
        }

        let searchValue = inputRef.current.value;

        if (delimiter.length) {
            searchValue = getWordAtPosition(searchValue, inputRef.current.selectionStart).word;
        }

        // fuzzy search using Fuse
        let fuseResults = fuse.search(searchValue);
        
        // if delimiter is set and duplicates are not allowed, 
        // don't show results for duplicates
        if (delimiter.length && !allowDuplicates) {
            const items = inputRef.current.value.split(delimiter);

            fuseResults = fuseResults.filter((result) => {
                return !items.includes(result.item);
            });
        }

        // show only first 7 results
        fuseResults = fuseResults.splice(0, 7);

        // if field non-empty, search, else show all items
        if (searchValue.length) {
            setResults(fuseResults.map((fuseResult) => {return {
                name: fuseResult.item,
                refIndex: fuseResult.refIndex
            }}));
            setTimeout(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }

    function hideResults(event) {
        if (!resultsRef.current.contains(event.relatedTarget)) {
            setVisible(false);
        }
    }

    function updateFocusedResult(addition) {
        if (addition === 1 && focusedResult < results.length - 1) {
            setFocusedResult(focusedResult + 1);
        } else if (addition === -1 && focusedResult > 0) {
            setFocusedResult(focusedResult - 1);
        } else if (addition === 1) {
            setFocusedResult(0);
        } else if (addition === -1) {
            setFocusedResult(results.length - 1);
        }
    }

    function keyDown(event) {
        if (event.key === "ArrowDown") {
            event.preventDefault();

            updateFocusedResult(+1);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();

            updateFocusedResult(-1);
        } else if (event.key === "Enter") {
            event.preventDefault();

            // inputRef.current.value = results[focusedResult];
            chooseResult(results[focusedResult]);
            setVisible(false);
        }
    }

    return (
        <div className={`search-input ${visible && results.length ? 'results-visible': ''}`}>
            <input 
                ref={inputRef} 
                onChange={search} 
                onInput={onInput}
                onFocus={search} 
                onBlur={hideResults}
                placeholder={placeholder}
                onKeyDown={keyDown}
                id={id}
                // conditionally add value attr if not null
                {...(value !== null ? {value: value} : {})}
            />
            <div className='search-results' ref={resultsRef} onClick={clickResult} style={{ display: visible && results.length ? 'flex': 'none' }}>
                <span>Suggestions</span>
                {list}
            </div>
            <ChevronDown size={20} className={`search-chevron ${visible && results.length ? 'show-results': ''}`} />
        </div>
    )
});

export default SearchInput;