var highlightSwith = true;
var dialogUp = false;
var storage;
var generatedID = 1;
var ID;

waitForPageAndDo();

class Note {
    constructor(text, color) {
        this.text = text;
        this.color = color;
        let date = new Date();
        this.time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
}

function waitForPageAndDo() {
    document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" type="text/css" href="style.css">');
    document.addEventListener("DOMContentLoaded", inspectElements);
    storage = window.sessionStorage;
    // storage can now store objects
    Storage.prototype.setObj = function (key, obj) {
        return this.setItem(key, JSON.stringify(obj))
    }
    Storage.prototype.getObj = function (key) {
        return JSON.parse(this.getItem(key))
    }
    document.addEventListener("DOMContentLoaded", setTitleAsNote);
}

function inspectElements() {
    let selected;

    document.addEventListener('mouseover', onMouseOverEvents);
    document.addEventListener('mousedown', onClickEvents);

    function onMouseOverEvents(e) {
        if (highlightSwith) {
            highlight(e);
        }

        function highlight(e) {
            // restoring default values
            if (selected) {
                selected.className = selected.className.replace(/\bhighlight\b/, '');
                selected = undefined;
            }
            // adds class to mouseover element
            if (e.target && e.target !== document.body && e.target.className !== "noteFlag") {
                selected = e.target;
                selected.className += "highlight";
            }
        }
    }
}

function onClickEvents(e) {
    if (e.target !== document.body) {
        if (!dialogUp) {
            ID = getOrSetIDOfElement(e.target);
            getDialog(e);
        }
        if (e.target.className === "noteFlag") {
            let parent = e.target.parentElemet;
            getDialog(parent);
        }
        if (e.target === document.getElementById("closeBtn")) {
            closeDialog();
        }

    }
}

function getDialog(e) {
    highlightSwith = false;
    dialogUp = true;
    if (!document.getElementById("modal")) {
        createDialog();
    } else {
        document.getElementById("modal").style.display = "block";
    }
    readNotesList(getOrSetIDOfElement(e.target));
}

function createDialog() {
    document.body.insertAdjacentHTML("beforeend",
    `<div id="modal" class="modal">
    <div class="Modal-content modal-content">
      <div class="Modal-header">
        <a id="closeBtn" class="closeBtn">&#x274C;</a>
        <h2>Add note to selected element.</h2>
      </div>
      <div class="Modal-body ">
        <textarea rows='4' cols='50' id="noteInput" placeholder="Type your note here" type="text"></textarea>
        <br>
        <label for="colorWell">Select note color:</label>
       <input type="color" id="colorWell">
        <br>
        <button onclick="addNote()">Add note</button>
      </div>
      <div class="Modal-footer ">
        <h2>Notes:</h2>
        <ul id="noteslist" class=""</ul>
    </div>
    </div>`);
}

function closeDialog() {
    clearDialog();
    document.getElementById("modal").style.display = "none";
    dialogUp = false;
    highlightSwith = true;
}

function addNote() {
    let modal = document.getElementById("modal");
    let note = new Note();
    note.text = modal.querySelector("#noteInput").value;
    note.color = modal.querySelector("#colorWell").value;
    clearDialog();
    writeToNotes(note, ID);
    readNotesList(ID);
}

function clearDialog() {
    let modal = document.getElementById("modal");
    modal.querySelector("#noteInput").value = "";
    modal.querySelector("#colorWell").value = "#000000";
}

function generateID() {
    if (generatedID) {
        generatedID++;
    }
    return "note_" + generatedID;
}

function getOrSetIDOfElement(_target) {
    if (!_target.id) {
        _target.id = generateID();
    }
    return _target.id;
}

function writeToNotes(comment, elementID) {
    if (!storage.getItem(elementID)) {
        let notes = [comment];
        storage.setObj(elementID, notes);
    } else {
        let notes = storage.getObj(elementID);
        notes.push(comment);
        storage.setObj(elementID, notes);
    }
    // TODO setIconsForNotes(elementID);
}

function readNotesList(elementID) {
    let ul = document.getElementById("noteslist");
    ul.innerHTML = "";
    let notes = storage.getObj(elementID);
    if (notes) {
        notes.forEach(element => {
            let li = document.createElement("li");
            li.innerHTML = element.time + " - " + element.text;
            li.style.color = element.color;
            li.className = "note"
            ul.appendChild(li);
        });
    }
}

function setTitleAsNote() {
    let elementsWithTitle = document.querySelectorAll("[title]");
    elementsWithTitle.forEach(element => {
        let titleNote = new Note(element.title, "#000000");
        writeToNotes(titleNote, getOrSetIDOfElement(element));
    });
}

function setIconsForNotes(elementID) {
    // TODO add icon to elementID
    let element = document.getElementById(elementID);
    let flag = document.createElement("span");
    flag.className = "noteFlag";
    flag.innerHTML = "N";
    element.insertAdjacentElement("beforeend", flag);
}
