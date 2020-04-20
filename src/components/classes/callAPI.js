import axios from 'axios';
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER} from "../../actions";


export const login = user => dispatch => {
    axios
        .post('http://localhost:4000/user/login', user)
        .then(res => { 
            
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);
                const decoded = jwt_decode(token);

                userData(token).then(resp => {
                    dispatch(setCurrentUser(resp.data));
                })
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
              })
        });
};

export const setCurrentUser = user => {
    return {
      type: SET_CURRENT_USER,
      payload: user
    };
};
  

export const userData = user => {
    return axios
        .get('http://localhost:4000/user/data', { headers : {token: user }})
        .then(res => {
            console.log(res.data.username);
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const deactivateUser = user => {
    return axios
        .get('http://localhost:4000/user/deactivate', { headers: {token: user }})
        .then(res=> {
            console.log("Succesfully deactivated");
        })
        .catch(error => {console.log(error)})
}

export const register = (user, history) => dispatch => {
    axios
        .post('http://localhost:4000/user/signup', user)
        .then(res => history.push("/login"))
        .catch(err =>
            dispatch({
            type: GET_ERRORS,
            payload: err.response.data
            })
        );
};

export const createPost = (post, history) => dispatch => {
    axios
        .post('http://localhost:4000/post/create', post)
        .then(res => console.log("Succesfully created post"))
        .catch(err =>
            dispatch({
            type: GET_ERRORS,
            payload: err.response.data
            })
        );
};

export const logout = () => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};