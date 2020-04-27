import axios from 'axios';
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, SET_POSTED, GET_POSTS } from "../../actions";


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
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const dataByUsername = user => {
    return axios
        .get('http://localhost:4000/user/dataByUser', { headers : {username: user }})
        .then(res => {  
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const getUser = user => {
    return axios
        .get('http://localhost:4000/user/getUser', { headers : {id: user }})
        .then(res => {  
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
        .then(res => {
            dispatch({
                type: SET_POSTED
            })
        })
        .catch(err =>
            dispatch({
            type: GET_ERRORS,
            payload: err.response.data
            })
        );
};

export const getHomePosts = user => {
    return axios
        .get('http://localhost:4000/post/home', { headers : {token: user }})
        .then(res => {
            return res;
        })
        .catch(error => {console.log(error)})
}

export const getPosts = (user, current, fit, lastDate, lastId) => dispatch => {
    return axios
    .get('http://localhost:4000/post/scroll', { headers : {token: user }, params: {current: current, fit: fit, lastDate: lastDate, lastId: lastId}})
    .then(res => {
        console.log(res.data);
        let posts = res.data.post;
        let postList = [];

        Object.keys(posts).forEach((key) => (
        postList.push(posts[key])
        ))

        dispatch({
            type: GET_POSTS,
            payload: postList
        })

        if(!res.data.last){
            getPosts(user, current, fit, lastDate, lastId);
        }

        return res;
    })
    .catch(error => {console.log(error)})
}

export const getPostsProfile = (user, current, fit, lastDate, lastId) => dispatch => {
    return axios
    .get('http://localhost:4000/post/scrollProfile', { headers : {userId: user }, params: {current: current, fit: fit, lastDate: lastDate, lastId: lastId}})
    .then(res => {
        console.log(res.data);
        let posts = res.data.post;
        let postList = [];

        Object.keys(posts).forEach((key) => (
        postList.push(posts[key])
        ))

        dispatch({
            type: GET_POSTS,
            payload: postList
        })

        if(!res.data.last){
            getPosts(user, current, fit, lastDate, lastId);
        }

        return res;
    })
    .catch(error => {console.log(error)})
}

export const logout = () => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};


export const editUser = (editProps, history) => dispatch => {
    axios
        .post('http://localhost:4000/user/edit', editProps)
        .then(res => {
            userData(res.data.token).then(resp => {
                dispatch(setCurrentUser(resp.data));
            })
        })
        .catch(err => {
            console.log("err")
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
                })
        }
            
    );
};