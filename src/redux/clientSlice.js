import { createSlice } from '@reduxjs/toolkit';

const clientState = {
	loading: false,
	error: false,
};

export const clientSlice = createSlice({
	name: 'client',
	initialState: clientState,
	reducers: {
		setListEvent: (state, action) => {
			let info = action.payload?.info;
			state.loading = false;
			state[action.payload.date] = info;

			return state;
		},
		setEventsLoading: (state, action) => {
			let value = { ...state, loading: action.payload };

			state = value;

			return state;
		},
	},
});

export const { setListEvent, setEventsLoading } = clientSlice.actions;

export default clientSlice.reducer;
