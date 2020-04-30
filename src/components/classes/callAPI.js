import axios from 'axios';
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, SET_POSTED, GET_POSTS, SET_FOLLOWERS } from "../../actions";

export const getHostname = () => {
    const port = ":8080";
    return (window.location.protocol + '//' + window.location.hostname + port + '/');
};

export const login = user => dispatch => {
    axios
        .post(getHostname() + 'api/user/login', user)
        .then(res => { 
            
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);
                const decoded = jwt_decode(token);

                userData(token).then(resp => {
                    dispatch(setCurrentUser(resp.data), setUserFollowers(resp.data));
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

export const setUserFollowers = user => {
    return {
        type: SET_FOLLOWERS,
        payload: {
            followers: user.followers,
            following: user.following
                
        }
    };
}
  

export const userData = user => {
    return axios
        .get(getHostname() + 'api/user/data', { headers : {token: user }})
        .then(res => {  
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const dataByUsername = user => {
    return axios
        .get(getHostname() + 'api/user/dataByUser', { headers : {username: user }})
        .then(res => {  
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const getUser = user => {
    return axios
        .get(getHostname() + 'api/user/getUser', { headers : {id: user }})
        .then(res => {  
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const deactivateUser = user => dispatch => {
    axios
        .get(getHostname() + 'api/user/deactivate', { headers: {token: user }})
        .then(res=> {
            localStorage.removeItem("jwtToken");
            setAuthToken(false);
            dispatch(setCurrentUser({}));
        })
        .catch(error => {console.log(error)})
}

export const register = (user, history) => dispatch => {
    axios
        .post(getHostname() + 'api/user/signup', user)
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
        .post(getHostname() + 'api/post/create', post)
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

export const followUser = (token, userId) => {
    return axios
        .get(getHostname() + 'api/user/follow', { headers: {token: token}, params: {id: userId}})
};

export const unfollowUser = (token, userId) => {
    return axios
        .get(getHostname() + 'api/user/unfollow', { headers: {token: token}, params: {id: userId}})
};

export const getFollowUsernames = (token, user) => {
    return axios
        .post(getHostname() + 'api/user/getFollowerUsernames', { token: token, user})
};

export const getHomePosts = user => {
    return axios
        .get(getHostname() + 'api/post/home', { headers : {token: user }})
        .then(res => {
            return res;
        })
        .catch(error => {console.log(error)})
}

export const getPosts = (user, current, fit, lastDate, lastId) => dispatch => {
    return axios
    .get(getHostname() + 'api/post/scroll', { headers : {token: user }, params: {current: current, fit: fit, lastDate: lastDate, lastId: lastId}})
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
    .get(getHostname() + 'api/post/scrollProfile', { headers : {userId: user }, params: {current: current, fit: fit, lastDate: lastDate, lastId: lastId}})
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
        .post(getHostname() + 'api/user/edit', editProps)
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