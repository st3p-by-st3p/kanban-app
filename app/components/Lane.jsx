import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.lane.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if (!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetId,
        noteId: sourceId
      });
    }
  }
};

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Lane extends React.Component {

  render() {
    const { connectDropTarget, lane, ...props } = this.props;

    return connectDropTarget(
      <div {...props}>
        <div className="lane-header" onClick={this.activateLaneEdit}>
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
          <Editable
              className="lane-name"
              editing={lane.editing}
              value={lane.name}
              onEdit={this.editName} />
          <div className="lane-delete">
            <button onClick={this.deleteLane}>x</button>
          </div>
        </div>
        <AltContainer
            stores={[NoteStore]}
            inject={{
              notes: () => NoteStore.getNotesByIds(lane.notes)
            }}>
          <Notes
              onValueClick={this.activateNoteEdit}
              onEdit={this.editNote}
              onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

  editNote(id, task) {
    // Don't modify if trying set an empty value
    if (!task.trim()) {
      NoteActions.update({ id, editing: false });

      return;
    }
    NoteActions.update({ id, task, editing: false });
  }

  addNote = (e) => {
    // If note is added, avoid opening lane name edit by stopping
    // event bubbling in this case.
    e.stopPropagation();

    const laneId = this.props.lane.id;
    const note = NoteActions.create({task: 'New task'});

    LaneActions.attachToLane({
      noteId: note.id,
      laneId
    });
  };

  deleteNote = (noteId, e) => {
    e.stopPropagation();

    const laneId = this.props.lane.id;
    LaneActions.detachFromLane({ noteId, laneId });
    NoteActions.delete(noteId);
  };

  editName = (name) => {
    const laneId = this.props.lane.id;

    if(!name.trim()) {
      LaneActions.update({ id: laneId, editing: false });

      return;
    }

    LaneActions.update({ id: laneId, name, editing: false });
  };

  deleteLane = () => {
    const laneId = this.props.lane.id;

    LaneActions.delete(laneId);
  };

  activateLaneEdit = () => {
    const laneId = this.props.lane.id;

    LaneActions.update({ id: laneId, editing: true });
  };

  activateNoteEdit(id) {
    NoteActions.update({ id, editing: true });
  }
}
