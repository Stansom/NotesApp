const noteNameInput = document.querySelector(".note-name-input");
const noteBodyInput = document.querySelector("#note-input-area");
const radioButtonsList = document.querySelector(".radio-buttons-list");
const deleteNoteButton = document.querySelector("#note-delete-button");

let notesContainer = [];

class Storage {
    static getNotes() {
        let notes;
        if (localStorage.getItem("notes") === null) {
            notes = [];
        } else {
            notes = JSON.parse(localStorage.getItem("notes"));
        }
        return notes;
    }

    static setNotes(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    static restoreNotes() {
        const newStorageArray = [];
        if (localStorage.getItem("notes") !== null) {
            let notes = JSON.parse(localStorage.getItem("notes"));
            notes.forEach(note => {
                const newNote = new Note(note.noteName, note.noteBody);
                newNote.id = note.id;
                newNote.color = note.color;
                newNote.active = note.active;

                newStorageArray.push(newNote);
            })
        }
        return newStorageArray;
    }

    static removeNote(note) {
        notesContainer.forEach( (n, i) => {
            if (note.id === n.id) {
                notesContainer.splice(i, 1);
            }
        })
    }

}

//!!!!!!!!! on iphone radio buttons items must be < 8pcs
class UI {
    constructor() {
        this.tools = new Tools();
    }

    static renderNote(note) {
        const noteName = document.querySelector(".note-name-input");
        const noteBody = document.querySelector("#note-input-area");
        const noteCreationDate = document.querySelector("#note-creation-date");
        noteName.value = note.noteName;
        noteBody.value = note.noteBody;
        noteCreationDate.textContent = note.creationDate;
        tools.applyBackgroundColor(note.color, "--list-background-color");
    }

    static createNewRadioButton(note) {
        const liRadio = document.createElement("li");
        liRadio.className = "radio-button-item";
        liRadio.id = note.id;
        liRadio.style.backgroundColor = note.color;
        // liRadio.setAttribute("button-active", "");
        radioButtonsList.appendChild(liRadio);
    }

    static renderNotesFromStorage() {
        const localNotes = [...notesContainer];
        const storageNotes = Storage.getNotes();
        if (storageNotes.length > 1) {
            notesContainer = Storage.restoreNotes();
            storageNotes.forEach((note) => {
                UI.createNewRadioButton(note);
                UI.renderNote(note);
            });
        }
        if (localNotes.length === 1) {
            localNotes.forEach((note) => {
                UI.createNewRadioButton(note);
                UI.renderNote(note);
            });
        }
    }

    static removeNote(note) {
        // if(note.id == radioButtonsList.id){
        //     console.log(radioButtonsList.id)
        // }
        // const activeRadioButton = document.querySelector("li[button-active]")
        console.log(radioButtonsList)
    }
}

class Tools {
    backgroundColorGenerator() {
        return Math.floor(Math.random() * 355);
    }

    static cloneArray = (items) => items.map(item => Array.isArray(item) ? cloneArray(item) : item);

    softTonesGeneratorHSL() {
        const hue = this.backgroundColorGenerator();
        return `hsl(${hue}, 58%, 70%)`;
    }

    applyBackgroundColor(hsl, property) {
        // const generated = this.softTonesGeneratorHSL();
        document.documentElement.style.setProperty(property, hsl);
    }

    dateGenerator() {
        const date = new Date();
        return `${
            date.getDate() % 10 ? "0" + date.getDate() : date.getDate()
        }/${date.getMonth()}/${date.getFullYear()}`;
    }

    idGenerator() {
        const date = new Date();
        return Math.floor(
            (Math.random() * 10 * (date.getMilliseconds() * date.getFullYear())) /
            date.getDate()
        );
    }

    deactivateListEntries() {
        const activeLis = document.querySelectorAll("li[button-active]");
        activeLis.forEach(li => li.removeAttribute("button-active"));
    }
}

class Note {
    constructor(noteName = "", noteBody = "") {
        this.tools = new Tools();
        this.noteName = noteName;
        this.noteBody = noteBody;
        this.creationDate = this.tools.dateGenerator();
        this.id = this.tools.idGenerator();
        this.color = this.tools.softTonesGeneratorHSL();
        this.active = false;
    }

    setName(name) {
        this.noteName = name;
    }

    setColor(color) {
        this.color = color;
    }

    setActiveToggle() {
        this.active = !this.active;
    }

    setActive(bool) {
        notesContainer.forEach(note => note.active = false);
        this.active = bool;
    }

    setText(text) {
        this.noteBody = text;
    }
}

noteBodyInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    const radioListActiveNote = document.querySelector("li[button-active]");

    if (noteBodyInput && radioListActiveNote) {
        const note = notesContainer.filter(
            (n) => n.id == radioListActiveNote.id
        )[0];
        note.setText(noteBodyInput.value);
        Storage.setNotes(notesContainer);
    }
});

noteNameInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    const radioListActiveNote = document.querySelector("li[button-active]");

    if (noteNameInput && radioListActiveNote) {
        const note = notesContainer.filter(
            (n) => n.id == radioListActiveNote.id
        )[0];
        note.setName(noteNameInput.value.toUpperCase());
        Storage.setNotes(notesContainer);
    }
});

//array deep copy

const tools = new Tools();

window.addEventListener("DOMContentLoaded", (e) => {
    UI.renderNotesFromStorage();
    if (notesContainer.length < 1) {
        console.log("notesContainer.length < 1")
        let note1 = new Note();
        notesContainer.push(note1);
        UI.renderNotesFromStorage();
    }
    tools.deactivateListEntries();
});

radioButtonsList.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("radio-button-item")) {
        const listLastChild = radioButtonsList.lastElementChild;
        if (e.target.id === listLastChild.id) {
            const lastNote = notesContainer[notesContainer.length - 1];
            let noteName = document.querySelector(".note-name-input").value;
            let noteText = document.querySelector("#note-input-area").value;
            const newNote = new Note();
            newNote.active = true;
            notesContainer.push(newNote);
            UI.createNewRadioButton(newNote);
            UI.renderNote(newNote);
            Storage.setNotes(notesContainer);
            e.target.className = "radio-button-item noafter";
        }

        radioButtonsList.childNodes.forEach((child) => {
            if (child.attributes !== undefined) {
                if (child.id === e.target.id) {
                    tools.deactivateListEntries();
                    const note = notesContainer.filter(
                        (note) => note.id == e.target.id
                    )[0];
                    e.target.setAttribute("button-active", "");
                    const oneActiveLi = document.querySelector
                    ("li[button-active]");
                    note.setActive(true);
                    UI.renderNote(note);
                }
            }
        });
    }
});

deleteNoteButton.addEventListener("click", (e) => {
    const activeRadioButton = document.querySelector("li[button-active]")
    if (activeRadioButton) {
        const noteToRemove = notesContainer.filter ( el => el.id == activeRadioButton.id)[0];
        const previousElement = activeRadioButton.previousElementSibling;
        const newActiveNote = notesContainer.filter( el => el.id == previousElement.id)[0];
        activeRadioButton.remove();
        Storage.removeNote(noteToRemove);
        newActiveNote.setActive(true);
        UI.renderNote(newActiveNote);
        previousElement.setAttribute("button-active", "");
        Storage.setNotes(notesContainer);
    }
});
