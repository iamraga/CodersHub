import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from './types';

//Get current profile
export const getCurrentProfile = () => dispatch => {
    
    //Set loading status true before getting profile
    dispatch(setProfileLoading());
    axios.get('/api/profile')
        .then(response => 
            dispatch({
                type: GET_PROFILE,
                payload: response.data
            })
        )
        .catch(error => 
            dispatch({
                type: GET_PROFILE,
                payload: {} //Keeping this empty, coz a user can have an account yet to create a profile. We will have a button asking them to create one.
            })
        );
}

//Set profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
}

//Clear current profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
}