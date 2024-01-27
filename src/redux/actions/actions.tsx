import { ADD_USER } from "./type";

export const addUser = (data: any) => {
    return {
        type: ADD_USER,
        payload: data
    }
};
