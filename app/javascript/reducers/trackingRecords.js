import { UPDATE_TRACKING_RECORDS, TOGGLE_EDITING, UPDATE_NOTE, DELETE_RECORD } from '../actions/ActionTypes';

export default function trackingRecords(state = [], action) {
  switch (action.type) {
    case UPDATE_TRACKING_RECORDS:
      return action.trackingRecords;
    case TOGGLE_EDITING:
      return [
        ...state.slice(0, action.recordIndex),
        {
          ...state[action.recordIndex],
          editing_status: !state[action.recordIndex].editing_status,
        },
        ...state.slice(action.recordIndex + 1),
      ];
    case UPDATE_NOTE:
      return [
        ...state.slice(0, action.recordIndex),
        {
          ...state[action.recordIndex],
          note: action.noteContent,
        },
        ...state.slice(action.recordIndex + 1),
      ];
    case DELETE_RECORD:
      return [
        ...state.slice(0, action.recordIndex),
        ...state.slice(action.recordIndex + 1),
      ];
    default:
      return state;
  }
}
