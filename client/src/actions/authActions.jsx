import { GET_ERRORS } from './types.jsx';
import { SET_CURRENT_USER } from './types.jsx';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post('/api/users/register', userData)
        .then(result => history.push('/login'))
        .catch(error => 
            dispatch({
                type: GET_ERRORS,
                payload: error.response.data
            })
        );
}

//Login - Get user token
export const loginUser = (userData) => dispatch => {
    axios
        .post('/api/users/login', userData)
        .then(response => {
            //Save to local storage
            const { token } = response.data;
            //Set token to localStorage
            localStorage.setItem('jwtToken', token);

            //Set token to auth header
            setAuthToken(token);
            //Decode token to get user data
            const decoded = jwt_decode(token);

            //Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(error => 
            dispatch({
                type: GET_ERRORS,
                payload: error.response.data
            })
        );
}

//Set logged in user
export const setCurrentUser = (decoded) => {
    //Set this to reducer with the decoded user data
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}