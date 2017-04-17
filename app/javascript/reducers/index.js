import { combineReducers } from 'redux';

import currentUser from './currentUser';
import trackingRecords from './trackingRecords';

const rootReducer = combineReducers({
  currentUser,
  trackingRecords,
});

export default rootReducer;
