document.getElementById('editor').addEventListener('mouseup', function() {
    let selection = window.getSelection();
    let selectedText = selection.toString();
    let menu = document.getElementById('context-menu');
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
        let menu = document.getElementById('context-menu');
        menu.style.display = 'none';
    };
});

document.getElementById('bold').addEventListener('click', function() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    let selectedText = range.extractContents();
    let newElement = document.createElement('b');
    newElement.appendChild(selectedText);

    range.insertNode(newElement);
});

document.getElementById('italic').addEventListener('click', function() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    let selectedText = range.extractContents();
    let newElement = document.createElement('i');
    newElement.appendChild(selectedText);

    range.insertNode(newElement);
});

document.getElementById('heading').addEventListener('click', function() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    let selectedText = range.extractContents();
    let newElement = document.createElement('h1');
    newElement.appendChild(selectedText);

    range.insertNode(newElement);
})

document.getElementById('body').addEventListener('click', function() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    let parentNode = range.commonAncestorContainer.parentNode;
    
    if (parentNode.nodeName.toLowerCase() === 'h1') {
        let docFrag = document.createDocumentFragment();
        while (parentNode.firstChild) {
            docFrag.appendChild(parentNode.firstChild);
        }
        parentNode.parentNode.replaceChild(docFrag, parentNode);
    }
});