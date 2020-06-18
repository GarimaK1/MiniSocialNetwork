import axios from 'axios';
import { setAlert } from './alertActions';
import { REGISTER_FAIL, REGISTER_SUCCESS } from '../actions/types';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

// Register user, get token
export const register = ({ name, email, password}) => async dispatch => {
    try {
        const res = await axios.post('/api/users', {name, email, password}, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
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