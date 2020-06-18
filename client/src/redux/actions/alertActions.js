// action creators
import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid';

/* Note:
In the code for setAlert and removeAlert, no async work is being done.
So we may skip the dispatch as we don't need thunk to deal with synchronous code.
In the 'connect'ed component, these action-creators will be dispatched to store 
as part of mapDispatchToProps object form in 'connect' by react-reducer 

However, if we do use redux-thunk, the thunk middleware intercepts our dispatch to the 
store and call it with `dispatch` and `getState` as arguments.
That is why we have dispatch available in the returned function as arguments here in actions.
This gives the thunk function the ability to run some logic, and still interact with the store.

For more info, see Readme.txt section "how we have access to "dispatch" in components and actions?"
*/

export const setAlert = (msg, alertType, timeout = 4000) => dispatch => {
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: { id, msg, alertType }
    });

    setTimeout(() => {
        dispatch({
            type: REMOVE_ALERT,
            payload: id
        });
    }, timeout);
};

export const removeAlert = (id) => dispatch => {
    dispatch({
        type: REMOVE_ALERT,
        payload: id
    });
}

/*

Both ways work fine! Tried and tested!

export const setAlert = (msg, alertType, timeout = 4000) => {
    const id = uuidv4();
    return {
        type: SET_ALERT,
        payload: { id, msg, alertType }
    };

    // Problem: Unreachable code this way. So lets keep dispatch.
    setTimeout(() => {
        return {
            type: REMOVE_ALERT,
            payload: id
        };
    }, timeout);
};

export const removeAlert = (id) => {
    return {
        type: REMOVE_ALERT,
        payload: id
    };
}
*/