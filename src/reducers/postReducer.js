import { SET_POSTED, UNSET_POSTED, GET_POSTS } from "../actions/index";

const initialState = {
    isPosted: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
        case SET_POSTED:
            return {
                ...state,
                isPosted: true,
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