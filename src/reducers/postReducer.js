import { SET_POSTED, UNSET_POSTED } from "../actions/index";

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
      default:
        return state;
    }
  }