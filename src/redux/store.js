import { configureStore, combineReducers } from '@reduxjs/toolkit';
import adminReducer from './adminSlice';
import userReducer from './userSlice';
import clientReducer from './clientSlice';

const reducer = combineReducers({
	admin: adminReducer,
	user: userReducer,
	client: clientReducer,
});

export const store = configureStore({ reducer });
