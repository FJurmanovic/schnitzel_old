import axios from 'axios';
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, SET_POSTED, SET_COMMENTED, GET_POSTS, SET_FOLLOWERS } from "../../actions";

export const getHostname = () => {
    const port = ":8080"; //Port of react server
    return (window.location.protocol + '//' + window.location.hostname + port + '/'); //Returns hostname 
};

export const login = user => dispatch => { // Sends login data to backend and returns token
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

export const setCurrentUser = user => { //Function for storing current user data
    return {
      type: SET_CURRENT_USER,
      payload: user
    };
};

export const setUserFollowers = user => { //Function for storing current user followers
    return {
        type: SET_FOLLOWERS,
        payload: {
            followers: user.followers,
            following: user.following
                
        }
    };
}
  

export const userData = user => { //Sends token to backend and returns user data
    return axios
        .get(getHostname() + 'api/user/data', { headers : {token: user }})
        .then(res => {  
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const dataByUsername = user => { //Sends username to backend and returns user data 
    return axios
        .get(getHostname() + 'api/user/dataByUser', { headers : {username: user }})
        .then(res => {  
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const getUser = user => { //Sends id of user to backend and returns user data
    return axios
        .get(getHostname() + 'api/user/getUser', { headers : {id: user }})
        .then(res => {  
            return res;
            
        })
        .catch(error => {console.log(error)})
}

export const deactivateUser = user => dispatch => { //Sends token to backend that removes user from database
    axios
        .get(getHostname() + 'api/user/deactivate', { headers: {token: user }})
        .then(res=> {
            localStorage.removeItem("jwtToken");
            setAuthToken(false);
            dispatch(setCurrentUser({})); //remove token from localStorage and removes auth token
        })
        .catch(error => {console.log(error)})
}

export const register = (user, history) => dispatch => { //Sends registration data to backend and returns token
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

export const createPost = (post, data, history) => dispatch => { //sends post data to backend and returns postId
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

export const uploadImage = (data, headers) => { //Sends image data with headers(id and type) to backend that stores image to backend and cloudinary
    return axios
        .post(getHostname() + 'api/post/image-upload', data, {headers: headers})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}

export const editPost = (post, history) => dispatch => { //Sends post data that needs to be updated to backend
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

export const newComment = (comment, history) => dispatch => { //Sends comment data and postID to backend
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

export const followUser = (idUser, id) => { //Sends user id's to backend that adds them to follow list in database
    return axios
        .get(getHostname() + 'api/user/follow', { params: {idUser: idUser, id: id}})
};

export const addPoint = (token, id, type) => { //Sends token with post id that adds new point to post
    return axios
        .get(getHostname() + 'api/post/addPoint', { headers: {token: token}, params: {id: id, type: type}})
};

export const removePoint = (token, id, type) => { //Sends token with post id that removes point from post
    return axios
        .get(getHostname() + 'api/post/removePoint', { headers: {token: token}, params: {id: id, type: type}})
};

export const addPointToComment = (token, id, type, commentId) => { //-||- But also sends commentId that adds point to that comment
    return axios
        .get(getHostname() + 'api/post/addPoint', { headers: {token: token}, params: {id: id, type: type, commentId: commentId}})
};

export const removePointToComment = (token, id, type, commentId) => { // -||- But it removes it
    return axios
        .get(getHostname() + 'api/post/removePoint', { headers: {token: token}, params: {id: id, type: type, commentId: commentId}})
};

export const addPointToReply = (token, id, type, commentId, replyId) => { // -||- But it also sends replyId that adds point to that reply
    return axios
        .get(getHostname() + 'api/post/addPoint', { headers: {token: token}, params: {id: id, type: type, commentId: commentId, replyId: replyId}})
};

export const removePointToReply = (token, id, type, commentId, replyId) => { // -|| but it removes it
    return axios
        .get(getHostname() + 'api/post/removePoint', { headers: {token: token}, params: {id: id, type: type, commentId: commentId, replyId: replyId}})
};


export const unfollowUser = (idUser, id) => { //Sends user id's to backend that removes them from follow list in database
    return axios
        .get(getHostname() + 'api/user/unfollow', { params: {idUser: idUser, id: id}})
};

export const removePost = (token, idPost) => { //Sends token with postID that removes post if authenticated
    return axios
        .get(getHostname() + 'api/post/removePost', { headers: {token: token}, params: {idPost: idPost}})
};

export const getFollowUsernames = id => { //Sends user id and returns followers for that user
    return axios
        .post(getHostname() + 'api/user/getFollowerUsernames', { id: id })
};

export const getPostById = (user, id) => { //Sends token and postID and returns postdata for that post
    return axios
    .get(getHostname() + 'api/post/getPost', { headers : {token: user }, params: {id: id}})
    .then(res => {
        return res;
    })
    .catch(error => {console.log(error)})
}

export const getPostForEdit = (user, id) => { //-||- but only gets data that can be edited
    return axios
    .get(getHostname() + 'api/post/getPostForEdit', { headers : {token: user }, params: {id: id}})
    .then(res => {
        return res;
    })
    .catch(error => {console.log(error)})
}

export const getPosts = (user, current, fit, lastDate, lastId) => dispatch => { //Sends token, and some parameters for infinite scorll 
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

export const getPostsProfile = (user,  fit, lastDate, lastId) => { //-||- But for profiles
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


export const editUser = (editProps, history) => dispatch => { //Sends edit data for editing current user
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