const editableDiv = document.querySelector('div[contenteditable=true]'); // Select the contenteditable div

// Trigger this code every time we start typing in the selected element
editableDiv.addEventListener('input',function() {
    let regex = /\*(.*?)\*/g; // Specify the string selection between * characters 
    let content = editableDiv.innerHTML; // Select the content inside the div
    console.log('This is content:', content);
    
    if (regex.test(content)) {
        let selection = window.getSelection();
        console.log('This is selection:', selection);
            
        let range = selection.getRangeAt(0);
        console.log('This is range:', range);
            
        let caretOffset = range.startOffset;
        console.log('This is caretOffset:', caretOffset);        
    
        // Replacting the regex with the updated content
        content = content.replace(regex, function(boldContent) {
            return '<strong>' + boldContent.substring(1, boldContent.length - 1) + '</strong>';
        });
    

        // Invoking the updated content
        editableDiv.innerHTML = content;
        
        // Reset the caret position; remember – innerHTML destroys the DOM nodes
        if (editableDiv.childNodes[0].length > 0) {
            range.setStart(editableDiv.childNodes[0], Math.min(caretOffset, editableDiv.childNodes[0].length));
            range.setEnd(editableDiv.childNodes[0], Math.min(caretOffset, editableDiv.childNodes[0].length));
        } else {
            range.setStart(editableDiv, 0);
            range.setEnd(editableDiv, 0);
        }
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    
});