const fileInput = document.getElementById('file-input');
const xmlEditor = document.getElementById('xml-editor');
const parseBtn = document.getElementById('parse-btn');
const saveBtn = document.getElementById('save-btn');
const treeContainer = document.getElementById('tree-container');

// XML parse and display tree structure
function displayTree(xml) {
    treeContainer.innerHTML = '';
    const ul = document.createElement('ul');

    function createNode(node) {
        const li = document.createElement('li');
        li.className = 'node';

        const span = document.createElement('span');
        span.textContent = node.nodeName;
        li.appendChild(span);

        // display attributes
        if (node.attributes && node.attributes.length > 0) {
            const attributes = Array.from(node.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' ');
            const attrSpan = document.createElement('span');
            attrSpan.textContent = ` [${attributes}]`;
            attrSpan.style.color = 'blue';
            li.appendChild(attrSpan);
        }

        // display text content if exists and is not just whitespace
        const textContent = node.textContent.trim();
        if (textContent && !node.children.length) {
            const textSpan = document.createElement('span');
            textSpan.textContent = `: ${textContent}`;
            textSpan.style.color = 'black';
            li.appendChild(textSpan);
        }

        if (node.children.length > 0) {
            const childUl = document.createElement('ul');
            for (const child of node.children) {
                      childUl.appendChild(createNode(child));
            }
            li.appendChild(childUl);
            li.classList.add('collapsed');
            span.addEventListener('click', () => {
                      li.classList.toggle('collapsed');
            });
        }

        return li;
    }

    ul.appendChild(createNode(xml.documentElement));
    treeContainer.appendChild(ul);
}

// validate XML syntax
function parseXML(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'application/xml');
    const parserError = xml.querySelector('parsererror');
    if (parserError) {
        alert('Invalid XML: ' + parserError.textContent);
        return null;
    }
    return xml;
}

// load XML file
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            xmlEditor.value = reader.result;
        };
        reader.readAsText(file);
    }
});

// parse XML button
parseBtn.addEventListener('click', () => {
    const xmlString = xmlEditor.value;
    const xml = parseXML(xmlString);
    if (xml) {
        displayTree(xml);
    }
});

// Save XML button
saveBtn.addEventListener('click', () => {
    const blob = new Blob([xmlEditor.value], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newXML.xml';
    a.click();
    URL.revokeObjectURL(url);
});
