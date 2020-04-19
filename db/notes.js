const util = require("util");
const fs = require("fs");

const readFileAsyn = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Notes {
    constructor() {
        this.idDum = 0;
    }

    read() {
        return readFileAsyn("db/db.json");

    }

    write(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note))
    }

    getNotes() {
        return this.read().then(notes => {
            let noteArray;
            try {
                noteArray = [].concat(JSON.parse(notes));
            }
            catch (err) {
                noteArray = [];
            }
            return noteArray;
        })
    }

    addNotes(note) {
        const { title, text } = note;
        const newNote = { title, text, id: ++this.idDum }
        return this.getNotes()
            .then(notes => [...notes, newNote])
            .then(updateNotes => this.write(updateNotes))
            .then(() => newNote)
    }

    removeNote(id) {
        return this.getNotes()
            .then(notes => notes.filter(note => note.id !== parseInt(id)))
            .then(updatedNotes => this.write(updatedNotes))
    }
}

module.exports = new Notes();