import { createStore } from 'redux';
import usersReducer from './reducers/usersReducer';
import { InitialStateI } from './reducers/usersReducer';

const store = createStore<InitialStateI, any, any, any>(
    usersReducer,
);

export default store;