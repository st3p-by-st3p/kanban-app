import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {

  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];

    this.exportPublicMethods({
      getNotesByIds: this.getNotesByIds.bind(this)
    });
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

    return note;
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

  getNotesByIds(ids) {
    // 1.Make sure we are operating on an array and
    // map over the ids
    // [id, id, id] -> [[Note], [], Note[], ...]
    return (ids || []).map(
      // 2. Extract matching notes
      // [Note, Note, Note, ...] -> [Note] (match) or [] (no match)
      id => this.notes.filter( note => note.id === id)
    // 3. Filter out possible empty arrays and get notes
    ).filter(a => a.length).map(a => a[0]);
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
