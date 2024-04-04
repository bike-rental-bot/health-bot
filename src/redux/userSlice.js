import { createSlice } from '@reduxjs/toolkit';

const userState = {
	token: null,
	user: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState: userState,
	reducers: {
		setUserInfo: (state, action) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
	},
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
