import { configureStore, combineReducers } from '@reduxjs/toolkit';
import adminReducer from './adminSlice';
import userReducer from './userSlice';
import clientReducer from './clientSlice';
import appSlice from './appSlice';

const reducer = combineReducers({
	admin: adminReducer,
	user: userReducer,
	client: clientReducer,
	app: appSlice,
});

export const store = configureStore({ reducer });
