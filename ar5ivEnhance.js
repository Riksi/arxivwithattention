let enhance = function() {
    // This already exists but is in the footer 
    // so move it to the top where it is fixed
    let themeSwitch = document.querySelector('.ar5iv-toggle-color-scheme');
    themeSwitch.style.position = 'fixed';
    themeSwitch.style.top = '0';
    themeSwitch.style.right = '0';

    // Collect all the links to internal references 
    // and filter to exclude bibliography links 
    // and links to other sections of the document
    let links = Array.from(document.querySelectorAll('a.ltx_ref'));

    function includeLink(link) {
        let href = link.getAttribute('href');
        // Ensure the link has an href attribute
        if (href == null) return false;
        // Ensure it is internal
        if (href.slice(0, 1) != '#') return false;
        // Exclude bibliography links which are already handled by the website
        if (href.slice(0, 4) == '#bib') return false;
        // Exclude links to other sections of the document
        if (href.includes('.SS')) return false;
        return true;
    }

    links = links.filter(includeLink);
    console.log('Number of links: ' + links.length);

    // Create the modal-like div that will display the content 
    // of the links
    let div = document.createElement('div');
    div.style.display = 'none';
    div.style.backgroundColor = 'white';
    div.style.border = '1px solid black';
    div.style.padding = '1em';
    div.style.zIndex = '1000';
    div.style.maxWidth = '50%';
    div.style.maxHeight = '500px';
    div.style.overflowY = 'scroll';
    // Center the modal on the page
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';

    // Add functionality to drag the div around the page
    div.onmousedown = dragMouseDown;

    let elmnt = div;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
    
    // Create the close button to close the div
    let closeButton = document.createElement('div');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.width = '21px';
    closeButton.style.height = '21px';
    closeButton.style.backgroundColor = 'white';
    closeButton.style.border = '2px double black';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1001';
    closeButton.innerHTML = '×';
    closeButton.style.textAlign = 'center';

    div.appendChild(closeButton);
    document.body.appendChild(div);

    // Functionality to display the content of the links
    // when the mouse hovers over them
    // We are using mouseover instead of click because
    // we want to retain the functionality 
    // of clicking on the link which goes to the content 
    let clones = [];
    links.forEach(function(link) {
        let href = link.getAttribute('href');

        function clearDiv() {
            for (const clone of clones) {
                clone.parentNode.removeChild(clone);
            }
            clones = [];
        }

        link.addEventListener('mouseover', function(e) {
            if (div.style.display == 'block') div.style.display = 'none';
            clearDiv();
            let node = document.getElementById(href.slice(1)).cloneNode(true);
            node.style.margin = 'auto';
            node.style.maxWidth = '90%';
            node.id = 'clone-' + href;
            clones.push(node);
            div.appendChild(node);
            div.style.display = 'block';
        });
    });

    // Add event listener to close the div when the close button is clicked
    closeButton.addEventListener('click', function() {
        div.style.display = 'none';
    });
}

enhance();