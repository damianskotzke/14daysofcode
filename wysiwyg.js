const editor = document.getElementById('editor');
const menu = document.getElementById('context-menu');
const bold = document.getElementById('bold');
const italic = document.getElementById('italic');
const heading = document.getElementById('heading');

let selection = window.getSelection();

editor.addEventListener('mouseup', function() {
    let selectedText = selection.toString();
    if (selectedText.length > 0) {
        let range = selection.getRangeAt(0);
        let rect = range.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = rect.top - rect.height + 'px';
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
});

document.addEventListener('click', function() {
    if (window.getSelection().toString() === '') {
        menu.style.display = 'none';
    };
});

bold.addEventListener('click', function() {
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let parentNode = range.commonAncestorContainer.parentNode;

    if (parentNode.nodeName.toLowerCase() != 'b') {
        let selectedText = range.extractContents();
        let newElement = document.createElement('b');
        newElement.appendChild(selectedText);
        range.insertNode(newElement);
    } else {
        let docFrag = document.createDocumentFragment();
        while (parentNode.firstChild) {
            docFrag.appendChild(parentNode.firstChild);
        }
        parentNode.parentNode.replaceChild(docFrag, parentNode);
    }
});

italic.addEventListener('click', function() {
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let parentNode = range.commonAncestorContainer.parentNode;

    if (parentNode.nodeName.toLowerCase() != 'i') {
        let selectedText = range.extractContents();
        let newElement = document.createElement('i');
        newElement.appendChild(selectedText);
        range.insertNode(newElement);
    } else {
        let docFrag = document.createDocumentFragment();
        while (parentNode.firstChild) {
            docFrag.appendChild(parentNode.firstChild);
        }
        parentNode.parentNode.replaceChild(docFrag, parentNode);
    }
});

heading.addEventListener('click', function() {
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let parentNode = range.commonAncestorContainer.parentNode;

    if (parentNode.nodeName.toLowerCase() != 'h1') {
        let selectedText = range.extractContents();
        let newElement = document.createElement('h1');
        newElement.appendChild(selectedText);
        range.insertNode(newElement);
    } else {
        let docFrag = document.createDocumentFragment();
        while (parentNode.firstChild) {
            docFrag.appendChild(parentNode.firstChild);
        }
        parentNode.parentNode.replaceChild(docFrag, parentNode);
    }
});