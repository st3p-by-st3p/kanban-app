import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {

  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];
  }

  create(note) {
    const notes = this.notes;
    note.id = uuid.v4();
    // This is a feature of Alt (this.setState(..)) that allows us
    // to signify that we are going to alter the store state.
    // -> Alt will signal the change to possible listeners.
    this.setState({
      notes: notes.concat(note)
    });
  }

  update(updatedNote) {
    const notes = this.notes.map( note => {
      if (note.id === updatedNote.id) {
        return Object.assign({}, note, updatedNote);
      }
      return note;
    });

    this.setState({ notes });
  }

  delete(noteId) {
    this.setState({
      notes: this.notes.filter( note => note.id !== noteId)
    });
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
