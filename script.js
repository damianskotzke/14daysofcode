const editableDiv = document.querySelector('div[contenteditable=true]');

editableDiv.addEventListener('input', function() {
    const regexBold = /\*(.+?)\*/g;
    const regexItalic = /\_(.+?)\_/g;
    const content = editableDiv.innerHTML;

    if (/\*(.+?)\*/g.test(content) || /\_(.+?)\_/g.test(content)) {
        const walker = document.createTreeWalker(editableDiv, NodeFilter.SHOW_TEXT);

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.parentNode.tagName === 'STRONG') {
                continue;
            }
            
            // Detect * and make the content bold
            let match;
            while ((match = regexBold.exec(node.textContent)) !== null) {
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
            }
    
            // Detect _ and make the content italicised
            while ((match = regexItalic.exec(node.textContent)) !== null) {
                const matchStart = match.index;
                const matchEnd = match.index + match[0].length;
    
                const before = document.createTextNode(node.textContent.slice(0,matchStart));
                const italic = document.createTextNode(node.textContent.slice(matchStart + 1, matchEnd - 1));
                const after = document.createTextNode(node.textContent.slice(matchEnd));
    
                node.parentNode.insertBefore(before, node);
                node.parentNode.insertBefore(after, node);
    
                const em = document.createElement('em');
                em.appendChild(italic);
                node.parentNode.insertBefore(em, after);
    
                node.parentNode.removeChild(node);
    
                walker.currentNode = after;
            }
        }
    }
    
});
