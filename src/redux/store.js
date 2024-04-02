import { configureStore, combineReducers } from '@reduxjs/toolkit';
import adminReducer from './adminSlice';

const reducer = combineReducers({
	admin: adminReducer,
});

export const store = configureStore({reducer});
