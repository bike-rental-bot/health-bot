import { configureStore, combineReducers } from '@reduxjs/toolkit';
import adminReducer from './adminSlice';
import userReducer from './userSlice';

const reducer = combineReducers({
	admin: adminReducer,
	user: userReducer,
});

export const store = configureStore({ reducer });
