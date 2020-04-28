import {combineReducers} from 'redux';

import authReducer from './authReducer';
import errReducer from './errReducer';
import postReducer from './postReducer';
import flwReducer from './flwReducer';


const appReducers = combineReducers({
    auth: authReducer,
    err: errReducer,
    post: postReducer,
    flw: flwReducer
}); 

export {appReducers};
export default appReducers;


