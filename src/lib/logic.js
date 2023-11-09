export default function logic(currentElement, data, root) {
    if (data.type == "create-element") {
        const elementType = data.element;
        const index = data.index;

        if (elementType == "text") {
            currentElement.append(data.content);

            return currentElement.lastChild;
        } else {
            // create element, add content and index
            const element = document.createElement(elementType);
            element.append(data.content);
            element.setAttribute("data-forge-index", index);

            if (currentElement.nodeType === Node.ELEMENT_NODE) {
                // append element to currently selected element
                currentElement.append(element);
            } else if (currentElement.nodeType === Node.TEXT_NODE) {
                // append element after currently selected text node
                currentElement.after(element);
            }

            return element;
        }
    } else if (data.type == "select-element") {
        return getElementByIndex(root, data.index);
    }
}

function getElementByIndex(root, index) {
    return root.querySelector(`[data-forge-index='${index}']`);
}