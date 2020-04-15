import {combineReducers} from 'redux';

import authReducer from './authReducer';
import errReducer from './errReducer';


const appReducers = combineReducers({
    auth: authReducer,
    err: errReducer
}); 

export {appReducers};
export default appReducers;


