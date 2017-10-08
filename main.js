function createTable(w, h) {
    var tableElement = document.createElement("table");
    for (var i = 0; i < h; i++) {
        tableElement.appendChild(createRow(w));
    }
    return tableElement;
}

function createRow(w) {
    var rowElement = document.createElement("tr");
    for (var i = 0; i < w; i++) {
        var cellElement = document.createElement("td");
        //cellElement.onclick = setClass;
        rowElement.appendChild(cellElement);
    }
    return rowElement;
}

function createCell(className) {
    var cellElement = document.createElement("td");
    var innerElement = document.createElement("div");
    innerElement.className = className;
    //innerElement.onclick = setClass;
    cellElement.appendChild(innerElement);
    return cellElement;
}

function setClass(e) {
    console.log(e);
    e.target.className = "tv-block-gray";
}

var pfLegend = {
    " ": "tv-empty",
    "-": "tv-block-ghost",
    "G": "tv-block-gray",
    "O": "tv-block-yellow",
    "J": "tv-block-blue",
    "L": "tv-block-orange",
    "i": "tv-block-cyan",
    "T": "tv-block-purple",
    "S": "tv-block-green",
    "Z": "tv-block-red",
};

function parsePlayfield(src) {
    var rows = src.split("\n");
    var tableElement = document.createElement("table");
    for (var y = 0; y < rows.length; y++) {
        var row = rows[y];
        var rowElement = document.createElement("tr");
        for (var x = 0; x < row.length; x++) {
            var chr = row[x];
            if (chr in pfLegend) {
                rowElement.appendChild(createCell(pfLegend[chr]));
            } else {
                rowElement.appendChild(createCell("tv-empty"));
            }
        }
        tableElement.appendChild(rowElement);
    }
    return tableElement;
}

function extractPlayfield(src) {
    if (typeof src !== "string") {
        console.error("given non-string source");
        return "";
    }

    var i = src.indexOf("<playfield>");
    if (i === -1) {
        console.error("open tag '<playfield>' not found");
        return "";
    }
    i += "<playfield>".length;

    var j = src.indexOf("</playfield>", i);
    if (j === -1) {
        console.error("closing tag '</playfield>' not found");
        return "";
    }

    var body = src.substring(i, j);
    // strip leading and trailing newlines
    body = body.replace(/^\n+|\n+$/g, '');
    return body
}

function updateWorkspace(pfSrc) {
    var workspaceElement = document.getElementById("workspace");

    var pfBody = extractPlayfield(pfSrc);
    var tableElement = parsePlayfield(pfBody);
    tableElement.className = "tv-playfield";

    // clear workspace
    workspaceElement.innerHTML = "";

    workspaceElement.appendChild(tableElement);

    // update output literal HTML
    var outputElement = document.getElementById("output");
    outputElement.innerHTML = escapeHTML(workspaceElement.innerHTML);
}

window.onload = function() {
    var inputElement = document.createElement("textarea");
    inputElement.id = "input";
    inputElement.oninput = function(e) {
        updateWorkspace(e.target.value);
    };
    inputElement.placeholder = "paste playfield data here\n\ne.g.\n<playfield>\n...\n</playfield>";
    document.body.appendChild(inputElement);

    var workspaceElement = document.createElement("div");
    workspaceElement.id = "workspace";
    workspaceElement.innerHTML = "(output appears here)";
    document.body.appendChild(workspaceElement);

    document.body.appendChild(document.createElement("br"));

    var outputTitleElement = document.createElement("span");
    outputTitleElement.style = "font-size: 1.2em;";
    outputTitleElement.innerHTML = 'generated html source (requires <a href="tetvis.css">tetvis stylesheet</a> to display correctly):';
    document.body.appendChild(outputTitleElement);
    var outputElement = document.createElement("div");
    outputElement.id = "output";
    document.body.appendChild(outputElement);
}

function escapeHTML(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
