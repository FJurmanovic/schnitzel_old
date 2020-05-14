import axios from 'axios';
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, SET_POSTED, SET_COMMENTED, GET_POSTS, SET_FOLLOWERS } from "../../actions";

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

export const createPost = (post, data, history) => dispatch => {
    axios
        .post(getHostname() + 'api/post/create', post)
        .then((res) => {
            console.log(data)
            let postId = res.data.id
            if(!!data){
                uploadImage(data, {"id": postId, "type": "post"})
            }
            dispatch({
                type: SET_POSTED
            })
        })
        .catch(err =>
            dispatch({
            type: GET_ERRORS,
            payload: err.data
            })
        );
};

export const uploadImage = (data, headers) => {
    return axios
        .post(getHostname() + 'api/post/image-upload', data, {headers: headers})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}

export const editPost = (post, history) => dispatch => {
    axios
        .post(getHostname() + 'api/post/edit', post)
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

export const newComment = (comment, history) => dispatch => {
    axios
        .post(getHostname() + 'api/post/newComment', comment)
        .then(res => {
            dispatch({
                type: SET_COMMENTED
            })
        })
        .catch(err =>
            dispatch({
            type: GET_ERRORS,
            payload: err.response.data
            })
        );
};

export const followUser = (idUser, id) => {
    return axios
        .get(getHostname() + 'api/user/follow', { params: {idUser: idUser, id: id}})
};

export const addPoint = (token, id, type) => {
    return axios
        .get(getHostname() + 'api/post/addPoint', { headers: {token: token}, params: {id: id, type: type}})
};

export const removePoint = (token, id, type) => {
    return axios
        .get(getHostname() + 'api/post/removePoint', { headers: {token: token}, params: {id: id, type: type}})
};

export const addPointToComment = (token, id, type, commentId) => {
    return axios
        .get(getHostname() + 'api/post/addPoint', { headers: {token: token}, params: {id: id, type: type, commentId: commentId}})
};

export const removePointToComment = (token, id, type, commentId) => {
    return axios
        .get(getHostname() + 'api/post/removePoint', { headers: {token: token}, params: {id: id, type: type, commentId: commentId}})
};

export const addPointToReply = (token, id, type, commentId, replyId) => {
    return axios
        .get(getHostname() + 'api/post/addPoint', { headers: {token: token}, params: {id: id, type: type, commentId: commentId, replyId: replyId}})
};

export const removePointToReply = (token, id, type, commentId, replyId) => {
    return axios
        .get(getHostname() + 'api/post/removePoint', { headers: {token: token}, params: {id: id, type: type, commentId: commentId, replyId: replyId}})
};


export const unfollowUser = (idUser, id) => {
    return axios
        .get(getHostname() + 'api/user/unfollow', { params: {idUser: idUser, id: id}})
};

export const removePost = (token, idPost) => {
    return axios
        .get(getHostname() + 'api/post/removePost', { headers: {token: token}, params: {idPost: idPost}})
};

export const getFollowUsernames = id => {
    return axios
        .post(getHostname() + 'api/user/getFollowerUsernames', { id: id })
};

export const getPostById = (user, id) => {
    return axios
    .get(getHostname() + 'api/post/getPost', { headers : {token: user }, params: {id: id}})
    .then(res => {
        return res;
    })
    .catch(error => {console.log(error)})
}

export const getPostForEdit = (user, id) => {
    return axios
    .get(getHostname() + 'api/post/getPostForEdit', { headers : {token: user }, params: {id: id}})
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

export const getPostsProfile = (user,  fit, lastDate, lastId) => {
    return axios
    .get(getHostname() + 'api/post/scrollProfile', { headers : {token: localStorage.jwtToken }, params: {userId: user, fit: fit, lastDate: lastDate, lastId: lastId}})
    .then(res => {
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