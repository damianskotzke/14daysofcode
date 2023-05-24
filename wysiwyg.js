// Initialise Supabase
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // your anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Load data
document.addEventListener('DOMContentLoaded', async function() {
    const { data, error} = await supabase
        .from('contents')
        .select('content')
        .eq('id', 1)
        .single();

    if (data && data.content) {
        editor.innerHTML = JSON.parse(data.content).content;
    };
});

// Objects
const editor = document.getElementById('editor');
const menu = document.getElementById('context-menu');
const url = document.getElementById('url');
const heading = document.getElementById('heading');
const bold = document.getElementById('bold');
const italic = document.getElementById('italic');
const image = document.getElementById('image');
const link = document.getElementById('link');

let selection = window.getSelection();
let savedRange;
let selectedElement;

// Functions
function clearSelection() {window.getSelection().removeAllRanges();};
function hideMenu() {menu.style.display = 'none';};

function buttonFormatting(object, tag) {
    object.addEventListener('click', function() {
        if (!selection.rangeCount) return;
        let range = selection.getRangeAt(0);
        let parentNode = range.commonAncestorContainer.parentNode;
    
        if (parentNode.nodeName.toLowerCase() != tag) {
            let selectedText = range.extractContents();
            let newElement = document.createElement(tag);
            newElement.appendChild(selectedText);

            if (tag === 'a') {
                newElement.setAttribute('class', 'link');
                //link.textContent = 'Remove link';
            }

            range.insertNode(newElement);
            clearSelection();
            hideMenu();
        } else {
            let docFrag = document.createDocumentFragment();

            if (tag === 'a') {
                //link.textContent = 'Add link';
            }

            while (parentNode.firstChild) {
                docFrag.appendChild(parentNode.firstChild);
            }
            parentNode.parentNode.replaceChild(docFrag, parentNode);
            clearSelection();
            hideMenu();
        }
    });
}

// Menu
editor.addEventListener('mouseup', function() {
    let selectedText = selection.toString();
    let range = selection.getRangeAt(0);
    let parentNode = range.commonAncestorContainer.parentNode;

    // Menu display & position
    if (selectedText.length > 0) {
        let range = selection.getRangeAt(0);
        let rect = range.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = rect.top - rect.height + 'px';
        menu.style.display = 'block';
    } else {
        hideMenu();
    };
    
    // URL input
    // Save the current selected reange whenever mouse is up in the editor
    if (parentNode.nodeName.toLowerCase() === 'a') {
        url.style.display = 'inline-block';
        savedRange = selection.getRangeAt(0);
        selectedElement = parentNode;
        url.value = parentNode.getAttribute('href');
    } else {
        url.style.display = 'none';
        url.value = '';
    };
});

// Hide the menu when clicked outside the editor
document.addEventListener('click', function(event) {
    if (!editor.contains(event.target)) {
        menu.style.display = 'none';
    };
});
url.addEventListener('click', function(event) {
    event.stopPropagation();
});

// Attach href to the 'a' tag
url.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (savedRange != null) {
            selection.removeAllRanges();
            selection.addRange(savedRange);
            //document.execCommand('createLink', false, url.value);

            let range = selection.getRangeAt(0);
            let parentNode = range.commonAncestorContainer.parentNode;

            if (parentNode.nodeName.toLowerCase() === 'a') {
                parentNode.setAttribute('href', url.value);
            };

            url.value = '';
            clearSelection();
            hideMenu();
        }
    }
});



// Heading
buttonFormatting(heading, 'h1');

// Bold
buttonFormatting(bold, 'b');

// Italic
buttonFormatting(italic, 'i');

// Link
buttonFormatting(link, 'a');

// Image
image.addEventListener('click', function() {
    document.getElementById('file').click();
});

document.getElementById('file').addEventListener('change', function(e){
    let selectedFile = e.target.files[0];
    let reader = new FileReader;

    reader.onload = function(event) {
        let img = new Image();
        img.src = event.target.result;

        let range = selection.getRangeAt(0);
        range.insertNode(img);
    };

    reader.readAsDataURL(selectedFile);
});

// Markdown content to link
editor.addEventListener('input', function() {
    const regexLink = /\[\[(.+?)\]\]/;
    const content = editor.textContent;

    if (regexLink.test(content)) {
        const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);

        while (walker.nextNode()) {
            const node = walker.currentNode;
            console.log(node);
            
            // Detect [[content]] and make the content a link
            let match = regexLink.exec(node.textContent);
            while (match !== null) {
                const matchStart = match.index;
                console.log(matchStart);
                const matchEnd = match.index + match[0].length;
                console.log(matchEnd);
                    
                const before = document.createTextNode(node.textContent.slice(0,matchStart));
                console.log(before);
                const linkInside = document.createTextNode(node.textContent.slice(matchStart + 2, matchEnd - 2));
                console.log(linkInside);
                const after = document.createTextNode(node.textContent.slice(matchEnd));
                console.log(after);
    
                node.parentNode.insertBefore(before, node);
                node.parentNode.insertBefore(after, node);
    
                const linkElement = document.createElement('a');
                linkElement.appendChild(linkInside);
                node.parentNode.insertBefore(linkElement, after);
                node.parentNode.removeChild(node);
    
                walker.currentNode = after;

                // Append zero-width space which moves it outside of the strong tag allow the caret to adjust
                editor.appendChild(document.createTextNode('\u200B'));

                // Position the caret at the end of the content
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(false); // false means collapse to the end
                selection.removeAllRanges();
                selection.addRange(range);
                match = null;

            }
        }
    }
    
});

// Saving as JSON file
/*editor.addEventListener('blur', function() {
    let editorContent = editor.innerHTML;
    let jsonObject = {
        content: editorContent
    };
    jsonContent = JSON.stringify(jsonObject);
    let blob = new Blob([jsonContent], {type: 'application/json'});
    let url = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'content.json';
    downloadLink.click();
});*/

// Saving to Supabase
editor.addEventListener('blur', async function() {
    let editorContent = editor.innerHTML;
    let jsonObject = {
        content: editorContent
    };
    
    // Save the content to the database
    const { data, error } = await supabase
        .from('contents')
        .upsert({ id: 1, content: JSON.stringify(jsonObject) });
});
