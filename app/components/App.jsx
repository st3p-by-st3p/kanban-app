import uuid from 'node-uuid';
import React from 'react';

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

  render() {
    const notes = this.state.notes;

    return (
      <div>
        <button onClick={this.addNote}>+</button>
        <ul>{notes.map( note =>
           <li key={note.id}>{note.task}</li>
        )}</ul>
      </div>
    );
  }
}
