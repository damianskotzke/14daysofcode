const editableDiv = document.getElementById('editor');

editableDiv.addEventListener('input', function() {
    console.log("I'm listening");
    const regexBold = /\*(.+?)\*/g;
    // const regexItalic = /\_(.+?)\_/g;
    const content = editableDiv.innerHTML;

    if (/\*(.+?)\*/g.test(content)) {
        console.log("I start walking");
        const walker = document.createTreeWalker(editableDiv, NodeFilter.SHOW_TEXT);

        while (walker.nextNode()) {
            console.log("I'm walking");
            const node = walker.currentNode;
            /*if (node.parentNode.tagName === 'STRONG') {
                break;
            }*/
            
            // Detect * and make the content bold
            let match;
            while ((match = regexBold.exec(node.textContent)) !== null) {
                console.log("I'm looping");
                const matchStart = match.index;
                const matchEnd = match.index + match[0].length;
    
                const before = document.createTextNode(node.textContent.slice(0,matchStart));
                const bold = document.createTextNode(node.textContent.slice(matchStart + 1, matchEnd - 1));
                const after = document.createTextNode(node.textContent.slice(matchEnd));
    
                node.parentNode.insertBefore(before, node);
                node.parentNode.insertBefore(after, node);
    
                const strong = document.createElement('strong');
                strong.appendChild(bold);
                node.parentNode.insertBefore(strong, after);
                node.parentNode.removeChild(node);
    
                walker.currentNode = after;

                // Append zero-width space which moves it outside of the strong tag allow the caret to adjust
                editableDiv.appendChild(document.createTextNode('\u200B'));

                // Position the caret at the end of the content
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(editableDiv);
                range.collapse(false); // false means collapse to the end
                selection.removeAllRanges();
                selection.addRange(range);

            }
        }
    }
    
});
