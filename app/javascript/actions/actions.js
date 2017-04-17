import * as types from './ActionTypes';
import moment from 'Moment';

export function setUser(currentUser) {
  localStorage.currentUser = JSON.stringify(currentUser);
  return {
    type: types.SET_USER,
    currentUser,
  };
}

export function updateTrackingRecords(trackingRecords) {
  let newTrackingRecords = trackingRecords.map(record => (
    {
      ...record,
      estimate: moment(record.estimate).calendar(),
    }
  ));

  return {
    type: types.UPDATE_TRACKING_RECORDS,
    trackingRecords: newTrackingRecords,
  };
}

export function toggleEditing(recordIndex) {
  return {
    type: types.TOGGLE_EDITING,
    recordIndex,
  };
}

export function deleteTrackingRecord(recordIndex) {
  return {
    type: types.DELETE_RECORD,
    recordIndex,
  };
}

export function updateNote(recordIndex, noteContent) {
  return {
    type:types.UPDATE_NOTE,
    recordIndex,
    noteContent,
  };
}

