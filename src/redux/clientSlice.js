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
			if (action.payload?.date && info) {
				let dateInfo = {
					hours: {},
					nutrition: [],
					preparations: [],
					day_regime: [],
				};
				for (let i = 0; i < info.length; i++) {
					let arrEl = info[i];

					let el = {
						description: arrEl.notify.description,
						title: arrEl.notify.description,
						type: arrEl.notify.type,
						attachment_url: arrEl.notify.attachment_url,
						is_completed: arrEl.is_completed,
						time: arrEl.time,
					};

					dateInfo[el.type]?.push(el);
					if (!dateInfo.hours[new Date(el.time).getHours()]) {
						dateInfo.hours[new Date(el.time).getHours()] = [el];
					} else {
						dateInfo.hours[new Date(el.time).getHours()].push(el);
					}
				}

				state[action.payload.date] = dateInfo;
			}

			return state;
		},
		setEventsLoading: (state, action) => {
			let value = { ...state, loading: action.payload };

			state = value;

			return state
		},
	},
});

export const { setListEvent, setEventsLoading } = clientSlice.actions;

export default clientSlice.reducer;
