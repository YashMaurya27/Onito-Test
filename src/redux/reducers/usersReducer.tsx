import { ADD_USER } from "../actions/type";

export interface InitialStateI {
  users: Array<any>;
};

const initialState: InitialStateI = {
  users: [],
};

const usersReducer = (state = initialState, action: any): InitialStateI => {
  switch (action.type) {
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    default:
      return state;
  }
};

export default usersReducer;
