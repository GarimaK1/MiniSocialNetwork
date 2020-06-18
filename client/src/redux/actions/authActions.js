import { 
    REGISTER_FAIL, 
    REGISTER_SUCCESS, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGIN_FAIL, 
    LOGIN_SUCCESS 
} from '../actions/types';
import axios from 'axios';
import { setAlert } from './alertActions';
import setAuthToken from '../../utils/setAuthToken';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    } 

    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data // user
        })
    } catch (error) {
        dispatch({ type: AUTH_ERROR});
    }
}

// Register user, get token
export const register = ({ name, email, password}) => async dispatch => {
    try {
        const res = await axios.post('/api/users', {name, email, password}, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data // token from backend
        })

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
}

// Login user, get token
export const login = (email, password) => async dispatch => {
    const body = JSON.stringify({email, password});
    try {
        const res = await axios.post('/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data // token from backend
        })

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({
            type: LOGIN_FAIL
        })
    }
}
