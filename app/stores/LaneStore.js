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
}

export default alt.createStore(LaneStore, 'LaneStore');
