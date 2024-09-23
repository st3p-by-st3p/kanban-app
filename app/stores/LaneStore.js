import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';

class LaneStore {

  constructor() {
    this.bindActions(LaneActions);
    this.lanes = [];
  }

  create(lane) {
    lane.id = uuid.v4();
    lane.notes = lane.notes || [];
    this.setState({
      lanes: this.lanes.concat(lane)
    });
  }

  attachToLane({ laneId, noteId }) {
    const lanes = this.lanes.map( lane => {
      if (lane.id === laneId) {
        if (lane.notes.includes(noteId)) {
          console.warn('Already attached note to lane', lanes);
        } else {
          lane.notes.push(noteId);
        }
      }

      return lane;
    });

    this.setState({ lanes });
  }

  detachFromLane({ laneId, noteId }) {
    const lanes = this.lanes.map( lane => {
      if (lane.id === laneId) {
        lane.notes = lane.notes.filter( note => note !== noteId);
      }

      return lane;
    });
  }
}

export default alt.createStore(LaneStore, 'LaneStore');
