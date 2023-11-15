// given certain classname as a string, convert to array
export function classNameToArray(className) {
    return className.split(/\s+/g);
}

// get word/substring between given delimiters around given position
export function getWordAtPosition(text, position, delimiter = ' ') {
    if (text[position] == delimiter) {
        position--;
    }

    let delimiterAfterPosition = text.indexOf(delimiter, position);
    let delimiterBeforePosition = text.lastIndexOf(delimiter, position);

    if (delimiterAfterPosition === -1) {
        delimiterAfterPosition = text.length;
    }

    if (delimiterBeforePosition === -1) {
        delimiterBeforePosition = 0;
    } else if (delimiterBeforePosition > 0) {
        delimiterBeforePosition++;
    }

    const textBefore = text.substring(delimiterBeforePosition, position);
    const textAfter = text.substring(position, delimiterAfterPosition);
    const word = textBefore + textAfter;

    return {
        word,
        start: position - textBefore.length,
        end: position + textAfter.length
    }
}