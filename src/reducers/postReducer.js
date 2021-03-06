import { SET_POSTED, UNSET_POSTED, GET_POSTS, SET_COMMENTED } from "../actions/index";

const initialState = {
    isPosted: false,
    isCommented: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
        case SET_POSTED:
            return {
                ...state,
                isPosted: true,
            };
        case SET_COMMENTED:
            return {
                ...state,
                isCommented: true,
            };
        case UNSET_POSTED:
            return {
                ...state,
                isPosted: false,
            };
        case GET_POSTS:
            return {
                ...state,
                post: action.payload,
            };
      default:
        return state;
    }
  }