import { createSlice } from '@reduxjs/toolkit';

const userState = {
	token: null,
	user: null,
	loading: true,
	error: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState: userState,
	reducers: {
		setUserInfo: (state, action) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
		setUserLoading: (state, action) => {
			state.loading = action.payload;
		},
		setUserError: (state, action) => {
			state.error = action.payload;
		}
	},
});

export const { setUserInfo, setUserError, setUserLoading } = userSlice.actions;

export default userSlice.reducer;
