import {combineReducers} from 'redux';

import loggedReducer from './isLogged';


const appReducers = combineReducers({
    isLogged: loggedReducer
}); 

export {appReducers};
export default appReducers;


