import { SET_FOLLOWERS } from "../actions/index";

const initialState = {
    followers: [],
    following: []
  };
  
  export default function(state = initialState, action) {
      let flwing = [];
      if(!(!state.following[0])){
        flwing = state.following
      }
    switch (action.type) {
      case SET_FOLLOWERS:
        flwing.push(action.payload.following)
        return {
          ...state,
          followers: state.followers,
          following: flwing[0]
        };
      default:
        return state;
    }
  }