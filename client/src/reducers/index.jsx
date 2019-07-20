import { combineReducers } from 'redux';
import authReducer from './authReducer.jsx';
import errorReducer from './errorReducer.jsx';
import profileReducer from './profileReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer
});