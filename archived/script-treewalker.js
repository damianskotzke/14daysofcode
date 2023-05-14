const editableDiv = document.querySelector('div[contenteditable=true]');

editableDiv.addEventListener('input', function() {
    const regex = /\*(.+?)\*/g;

    const walker = document.createTreeWalker(editableDiv, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentNode.tagName === 'STRONG') {
            // Skip text inside already-bold elements
            continue;
        }

        let match;
        while ((match = regex.exec(node.textContent)) !== null) {
            const matchStart = match.index;
            const matchEnd = match.index + match[0].length;

            // Create three new text nodes:
            // - before the match
            // - the match itself (without *)
            // - after the match
            const before = document.createTextNode(node.textContent.slice(0, matchStart));
            const bold = document.createTextNode(node.textContent.slice(matchStart + 1, matchEnd - 1));
            const after = document.createTextNode(node.textContent.slice(matchEnd));

            // Replace the original text node with the new ones
            node.parentNode.insertBefore(before, node);
            node.parentNode.insertBefore(after, node);

            // Wrap the "bold" text node in a <strong> element
            const strong = document.createElement('strong');
            strong.appendChild(bold);
            node.parentNode.insertBefore(strong, after);

            // Remove the original text node
            node.parentNode.removeChild(node);

            // The TreeWalker's current node was removed from the document, so
            // we need to manually set it to the "after" node
            walker.currentNode = after;
        }
    }
});
