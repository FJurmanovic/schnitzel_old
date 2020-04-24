import {combineReducers} from 'redux';

import authReducer from './authReducer';
import errReducer from './errReducer';
import postReducer from './postReducer';


const appReducers = combineReducers({
    auth: authReducer,
    err: errReducer,
    post: postReducer
}); 

export {appReducers};
export default appReducers;


