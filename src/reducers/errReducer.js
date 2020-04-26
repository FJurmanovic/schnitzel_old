import { GET_ERRORS } from "../actions";

const initialState = {
  type: '',
  message: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}
