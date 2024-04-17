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
			console.log('action', action.payload);
			if (action.payload?.info && action.payload?.date) {
				let info = action.payload?.info;
				state.loading = false;
				state[action.payload.date] = info;

				return state;
			}
		},
		setEventsLoading: (state, action) => {
			let value = { ...state, loading: action.payload };

			state = value;

			return state;
		},

		setEventComplete: (state, action) => {
			const { date, id, type } = action.payload;

			if (state && state[date] && state[date][type] && id !== undefined) {
				let arr = [...state[action.payload?.date][type]];
				state[action.payload?.date][type] = '';

				for (let i = 0; i < arr.length; i++) {
					if (arr[i].id === id) {
						arr[i].is_completed = true;
						break;
					}
				}

				state[action.payload?.date][type] = arr;
				return state;
			}
		},
	},
});

export const { setListEvent, setEventsLoading, setEventComplete } = clientSlice.actions;

export default clientSlice.reducer;
