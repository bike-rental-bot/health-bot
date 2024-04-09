import { createSlice } from '@reduxjs/toolkit';

const appState = {
	isOpenKeyboard: false,
	viewPort: false,
};

const WebApp = window.Telegram.WebApp;

export const appSlice = createSlice({
	name: 'app',
	initialState: appState,
	reducers: {
		setAppState: (state, action) => {
		
			state.isOpenKeyboard =
				action.payload.isOpenKeyboard !== undefined
					? action.payload.isOpenKeyboard
					: state.isOpenKeyboard;
			state.viewPort = action.payload.viewPort;
		},
	},
});

export const { setAppState } = appSlice.actions;

export default appSlice.reducer;
