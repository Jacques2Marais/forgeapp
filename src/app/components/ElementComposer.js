'use client';

import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, useReducer } from 'react';

function containsSelected(dataArray) {
    for (const item of dataArray) {
        if (item.isSelected) {
            return true;
        } else if (item.children) {
            const childContains = containsSelected(item.children);
            if (childContains) {
                return true;
            }
        }
    }

    return false;
}

function findObjectByIndex(dataArray, index) {
    for (const item of dataArray) {
        if (item.index === index) {
            return item;
        } else if (item.children) {
            const childContains = findObjectByIndex(item.children, index);
            if (childContains) {
                return childContains;
            }
        }
    }
}

function TreeNode({ isParent, data, item, level, onSelect }) {
    // initially only parent should be opened
    const [isOpen, setOpen] = useState(isParent || containsSelected(data));

    // open current node if tree just changed and the node contains the selected node
    useEffect(() => {
        if (containsSelected(item.children)) {
            setOpen(true);
        }
    }, [data]);

    return (
        <li className={`${item.isSelected ? 'tree-li-selected': ''}`} style={{'--level': level}}>
            <span className='tree-item-row'>
                <button className='button-expand' onClick={() => { setOpen(!isOpen) }}>
                    <ChevronRight fill='white' size={16} strokeWidth={3} className={`${isOpen ? 'rotate-90' : ''}`} />
                </button>
                <button className={`tree-item-title ${item.isSelected ? 'tree-item-selected' : ''}`} onClick={() => { onSelect(item.index) }}>
                    {item.elementType === "text" ?
                        <>
                            <span className='decorator'>#</span><span className='name'>{item.elementType}</span>
                        </>:
                        <>
                            <span className='decorator'>&lt;</span><span className='name'>{item.elementType}</span><span className='decorator'>&gt;</span>
                        </>
                    }
                </button>
            </span>
            {item.children && isOpen ? <Tree data={item.children} onSelect={onSelect} level={level + 1} /> : ''}
        </li>
    )
}

function Tree({ data, isParent = false, onSelect = (index) => {}, level = 0 }) {
    return (
        <>{data ? <ul>
            {data.map((item, index) => {
                return <TreeNode key={index} isParent={isParent} data={data} item={item} level={level} onSelect={onSelect} />
            })}
        </ul> : ''}</>
    )
}

export default function ElementComposer({ frameRef = useRef(null) }) {
    // refs to inputs
    const elementTypeInput = useRef(null);
    const elementContentInput = useRef(null);
    const elementClassInput = useRef(null);

    // ref to form
    const formRef = useRef(null);

    // index of next element to append (this-1 = index of last appended element)
    const elementIndex = useRef(1);

    // initial structure of tree on first render
    const intialTree = [{
        elementType: 'main',
        children: [],
        isSelected: true,
        index: 0
    }];

    // state of physical view of tree
    const [treeView, setTreeView] = useState(intialTree);

    // keep a copy of the tree and a reference to the current child for manipulation
    let tree = useRef(intialTree);
    let treeReference = useRef(tree.current[0]);

    function addElement(event) {
        event.preventDefault();

        // the type of element specified
        const elementType = elementTypeInput.current.value.toLowerCase();

        // was previous reference a text element (append after)?
        const wasTextElement = treeReference.current.elementType === "text";

        // create new child to add to tree
        const newObject = {
            elementType,
            children: [],
            isSelected: true,
            index: elementIndex.current,
            parent: wasTextElement ? treeReference.current.parent: treeReference.current
        };

        // unset current selected from previous reference
        treeReference.current.isSelected = false;

        // add new child to current position in tree
        if (wasTextElement) {
            treeReference.current.parent.children.push(newObject);
            treeReference.current = newObject;
        } else {
            treeReference.current.children.push(newObject);
            treeReference.current = newObject;
        }

        // update physical view of tree
        setTreeView(structuredClone(tree.current));

        // post message of action to iframe
        frameRef.current.contentWindow.postMessage({
            type: 'create-element',
            element: elementTypeInput.current.value,
            content: elementContentInput.current.value,
            classes: elementClassInput.current.value,
            index: elementIndex.current++
        });

        // clear values and focus on type input
        elementTypeInput.current.value = '';
        elementContentInput.current.value = '';
        elementClassInput.current.value = '';
        elementTypeInput.current.focus();
    }

    function onTreeSelection(index) {
        treeReference.current.isSelected = false;

        treeReference.current = findObjectByIndex(tree.current, index);
        treeReference.current.isSelected = true;

        setTreeView(structuredClone(tree.current));

        // post message of action to iframe
        frameRef.current.contentWindow.postMessage({
            type: 'select-element',
            index
        });
    }

    function onTypeInput(event) {
        if (event.target.value.toLowerCase() === 'text') {
            elementClassInput.current.setAttribute('disabled', true);
        } else {
            elementClassInput.current.removeAttribute('disabled');
        }
    }

    return (
        <div className='composer'>
            <form ref={formRef} onSubmit={addElement} className='composer-form'>
                <div className='input-group'>
                    <label htmlFor="elementType">Type of Element</label>
                    <input placeholder='Element type' id='elementType' onInput={onTypeInput} ref={elementTypeInput} />
                </div>
                <div className='input-group'>
                    <label htmlFor="elementClasses">Element's Classes</label>
                    <input placeholder='Classes' id='elementClasses' ref={elementClassInput} />
                </div>
                <div className='input-group'>
                    <label htmlFor="elementContent">Element's Inner Text</label>
                    <textarea placeholder='Content' id='elementContent' ref={elementContentInput}></textarea>
                </div>
                <button type="submit">+ Add Element</button>
            </form>
            <div className='element-tree'>
                <Tree data={treeView} isParent={true} onSelect={onTreeSelection} />
            </div>
        </div>
    )
}