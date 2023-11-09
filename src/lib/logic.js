export default function logic(currentElement, data, root) {
    // create an element and return it
    if (data.type == "create-element") {
        const elementType = data.element;
        const index = data.index;

        // create a text node & return
        if (elementType == "text") {
            currentElement.append(data.content);
            return currentElement.lastChild;

        // create an element node
        } else {
            // create element, add content and index
            const element = document.createElement(elementType);

            // add given content inside element
            element.append(data.content);

            // set element's index attr
            element.setAttribute("data-forge-index", index);

            // add given classes to element
            element.className = data.classes;

            if (currentElement.nodeType === Node.ELEMENT_NODE) {
                // append element to currently selected element
                currentElement.append(element);
            } else if (currentElement.nodeType === Node.TEXT_NODE) {
                // append element after currently selected text node
                currentElement.after(element);
            }

            return element;
        }

    // return element that has given forge-index (to select it)
    } else if (data.type == "select-element") {
        return getElementByIndex(root, data.index);
    } else if (data.type == "update-element") {
        if (typeof data.className === 'string') {
            currentElement.className = data.className;
        }

        return currentElement;
    }
}

// get element, given root element, that has given data-forge-index
function getElementByIndex(root, index) {
    return root.querySelector(`[data-forge-index='${index}']`);
}