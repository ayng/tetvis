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
        cellElement.onclick = setClass;
        rowElement.appendChild(cellElement);
    }
    return rowElement;
}

function createCell(className) {
    var cellElement = document.createElement("td");
    cellElement.className = className;
    cellElement.onclick = setClass;
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
    return body
}

function updateWorkspace(pfSrc) {
    var workspaceElement = document.getElementById("workspace");

    var pfBody = extractPlayfield(pfSrc);
    var tableElement = parsePlayfield(pfBody);
    tableElement.className = "board";

    // clear workspace
    workspaceElement.innerHTML = "";

    workspaceElement.appendChild(tableElement);
}

window.onload = function() {
    var inputElement = document.createElement("textarea");
    inputElement.className = "src-input";
    inputElement.oninput = function(e) {
        updateWorkspace(e.target.value);
    };
    inputElement.placeholder = "paste playfield data here\n\ne.g.\n<playfield>\n...\n</playfield>";
    document.body.appendChild(inputElement);

    document.body.appendChild(document.createElement("br"));

    var workspaceElement = document.createElement("div");
    workspaceElement.id = "workspace";
    workspaceElement.innerHTML = "(output appears here)";
    document.body.appendChild(workspaceElement);

}
