import {combineReducers} from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import TripsReducer from './trips';
import ConnectivityReducer from './connectivity';

export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  trips: TripsReducer,
  connectivity: ConnectivityReducer,
}); 