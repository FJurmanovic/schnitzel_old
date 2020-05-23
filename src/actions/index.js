export const login = () => {
    return {
        type: 'SIGN_IN'
    };
};

export const LOG_OUT = "LOG_OUT";

export const GET_ERRORS = "GET_ERRORS"; //Stores errors from request
export const SET_CURRENT_USER = "SET_CURRENT_USER"; //Sets current user(authenticates)

export const SET_POSTED = "SET_POSTED"; //Boolean for posting(auto refresh component)
export const UNSET_POSTED = "UNSET_POSTED";

export const SET_COMMENTED = "SET_COMMENTED"; //Boolean for commenting(auto refresh component)

export const GET_POSTS = "GET_POSTS"; //Stores posts

export const SET_FOLLOWERS = "SET_FOLLOWERS"; //Stores user followers