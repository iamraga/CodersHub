import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS, SET_CURRENT_USER, GET_PROFILES } from './types';
import { clearErrors } from './postActions';

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

//Get profile by handle
export const getProfileByHandle = (handle) => dispatch => {
    
    //Set loading status true before getting profile
    dispatch(setProfileLoading());
    axios.get(`/api/profile/handle/${handle}`)
        .then(response => 
            dispatch({
                type: GET_PROFILE,
                payload: response.data
            })
        )
        .catch(error => 
            dispatch({
                type: GET_PROFILE,
                payload: null
            })
        );
}

//Get profile by id
export const getProfileById = (id) => dispatch => {
    
    //Set loading status true before getting profile
    dispatch(setProfileLoading());
    axios.get(`/api/profile/user/${id}`)
        .then(response => 
            dispatch({
                type: GET_PROFILE,
                payload: response.data
            })
        )
        .catch(error => 
            dispatch({
                type: GET_PROFILE,
                payload: null
            })
        );
}

//Create profile
export const createProfile = (profileData, history) => dispatch => {
    dispatch(clearErrors());
    axios
        .post("/api/profile", profileData)
        .then(res => history.push('/dashboard'))
        .catch(error => {
            dispatch({
                type: GET_ERRORS,
                payload: error.response.data
            })
        })
}

//Add Experience
export const addExperience = (expData, history) => dispatch => {
    axios
        .post('/api/profile/experience', expData)
        .then(res => history.push('/dashboard'))
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
}

//Add Education
export const addEducation = (eduData, history) => dispatch => {
    axios
        .post('/api/profile/education', eduData)
        .then(res => history.push('/dashboard'))
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
}

//Delete Experience
export const deleteExperience = (id) => dispatch => {
    axios
        .delete(`/api/profile/experience/${id}`)
        .then(res => dispatch({
            type: GET_PROFILE,
            payload: res.data
        }))
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
}

//Delete Education
export const deleteEducation = (id) => dispatch => {
    axios
        .delete(`/api/profile/education/${id}`)
        .then(res => dispatch({
            type: GET_PROFILE,
            payload: res.data
        }))
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
}

//Get all profiles
export const getProfiles = () => dispatch => {
    dispatch(setProfileLoading);
    axios
        .get('/api/profile/all')
        .then(res => {
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: GET_PROFILES,
                payload: null
            })
        });
}

//Delete account
export const deleteAccount = () => dispatch => {
    if(window.confirm('Are you sure? This cannot be undone!')) {
        axios
            .delete('/api/profile')
            .then(res => {
                dispatch({
                    type: SET_CURRENT_USER,
                    payload: {}
                })
            })
            .catch(errors => {
                dispatch({
                    type: GET_ERRORS,
                    payload: errors.response.data
                })
            })
    }
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