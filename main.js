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
    innerElement.className = "tv-block" + " " + className;
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
    "-": "tv-ghost",
    "G": "tv-gray",
    "O": "tv-yellow",
    "J": "tv-blue",
    "L": "tv-orange",
    "I": "tv-cyan",
    "T": "tv-purple",
    "S": "tv-green",
    "Z": "tv-red",
};

function parsePlayfield(src) {
    var rows = src.split("\n");
    var tableElement = document.createElement("table");
    for (var y = 0; y < rows.length; y++) {
        var row = rows[y];
        var rowElement = document.createElement("tr");
        for (var x = 0; x < row.length; x++) {
            var chr = row[x].toUpperCase();
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

    // update 
    var cssomElement = document.getElementById("cssom");
    cssomElement.innerHTML = toCSSStyleSheet(cssom);
}

var examplePfSrc = 
`<playfield>
  JJJ     
    J     
          
          
          
J ---   i 
JJJZ-SLLi 
OOZZTSSLi 
OOZTTTSLi 
GGG GGGGGG
GGG GGGGGG
</playfield>`;

window.onload = function() {
    // input box
    var inputElement = document.createElement("textarea");
    inputElement.id = "input";
    inputElement.oninput = function(e) {
        updateWorkspace(e.target.value);
    };
    inputElement.placeholder = "paste playfield data here\n\ne.g.\n<playfield>\n...\n</playfield>";
    document.body.appendChild(inputElement);

    // workspace aka html preview area
    var workspaceElement = document.createElement("div");
    workspaceElement.id = "workspace";
    workspaceElement.innerHTML = "(output appears here)";
    document.body.appendChild(workspaceElement);

    // html output box
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(document.createElement("br"));

    var outputTitleElement = document.createElement("span");
    outputTitleElement.style = "font-size: 1.2em;";
    outputTitleElement.innerHTML = 'generated html source (requires <a href="tetvis.css">tetvis stylesheet</a> to display correctly):';
    document.body.appendChild(outputTitleElement);
    var outputElement = document.createElement("div");
    outputElement.id = "output";
    document.body.appendChild(outputElement);

    // css output
    console.log(toCSSStyleSheet(cssom));
    var cssomElement = document.createElement("style");
    cssomElement.id = "cssom";
    document.body.appendChild(cssomElement);

    // footer
    var footerElement = document.createElement("p");
    footerElement.innerHTML = '<a href="https://github.com/ayng/tetvis">view the source on github</a>';
    document.body.appendChild(footerElement);

    // manually update workspace
    inputElement.value = examplePfSrc;
    updateWorkspace(inputElement.value);
}

function escapeHTML(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function toCSSStyleSheet(cssom) {
    var ruleSets = [];
    for (var selector in cssom) {
        ruleSets.push(toCSSRuleSet(selector, cssom[selector]));
    }
    return ruleSets.join("\n\n")
}

function toCSSRuleSet(selector, rules) {
    var ruleList = [];
    for (var property in rules) {
        ruleList.push(toCSSRule(property, rules[property]));
    }
    return selector + " {\n" + ruleList.map(indent).join("\n") + "\n}";
}

function toCSSRule(property, value) {
    return property + ": " + value + ";";
}

function indent(s) {
    return "    " + s;
}

var cssom = {
    ".tv-playfield": {
        "display": "inline-block",
        "margin": "2px 3px",
        "border-spacing": "1",
    },
    ".tv-playfield td": {
        "padding": "0",
    },
    ".tv-block": {
        "width": "24px",
        "height": "24px",
        "box-sizing": "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box",
    },
    ".tv-yellow": {
        "background-color": "#ffd900",
    },
    ".tv-blue": {
        "background-color": "#195af0",
    },
    ".tv-orange": {
        "background-color": "#ff8000",
    },
    ".tv-cyan": {
        "background-color": "#0cf",
    },
    ".tv-purple": {
        "background-color": "#882ed1",
    },
    ".tv-green": {
        "background-color": "#5bd742",
    },
    ".tv-red": {
        "background-color": "#e74040",
    },
    ".tv-ghost": {
        "border": "1px gray dashed",
    },
    ".tv-gray": {
        "background-color": "gray",
    },
    ".tv-empty": {
    },
};
