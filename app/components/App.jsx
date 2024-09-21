import uuid from 'node-uuid';
import React from 'react';
import Notes from './Notes.jsx';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Learn Webpack'
        }, {
          id: uuid.v4(),
          task: 'Learn React'
        }, {
          id: uuid.v4(),
          task: 'Do laundry'
        }, {
          id: uuid.v4(),
          task: 'Complete a sprint'
        }
      ]
    };
  }

  // We are using an experimental feature knowns as property
  // initializer here. It allows us to bind the method 'this'
  // to point to our *App* instance.
  //
  // Alernatively we could `bind` at `constructor` using
  // a line, such as this.addNote = this.addNote.bind(this);
  addNote = () => {
    // It would be possible to write this in imperative style.
    // I.e., through `this.state.notes.push` and then
    // `this.setState({notes: this.state.notes})` to commit.
    //
    // I tend to favor functional style whenever that makes sense.
    // Even though it might take more code sometimes, I feel
    // the benefits (easy to reason about, no side effects)
    // more than make up for it.
    //
    // Libraries, such as Immutable.js, go a notch further.
    this.setState({
      notes: this.state.notes.concat([{
        id: uuid.v4(),
        task: 'New task'
      }])
    }, () => { console.log('the state was updated!'); });
  };

  editNote = (id, task) => {
    // Don't modify if trying to set an empty value
    if (!task.trim()) {
      return;
    }

    const notes = this.state.notes.map( note => {
      if (note.id === id && task) {
        note.task = task;
      }
      return note;
    });

    this.setState({notes});
  }

  render() {
    const notes = this.state.notes;

    return (
      <div>
        <button onClick={this.addNote}>+</button>
        <Notes notes={notes} onEdit={this.editNote} />
      </div>
    );
  }
}
