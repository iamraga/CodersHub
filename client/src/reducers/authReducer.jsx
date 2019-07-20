import { SET_CURRENT_USER } from '../actions/types.jsx';
import isEmpty from '../validation/isempty';

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_CURRENT_USER: 
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            }
        default: 
            return state;
    }
}