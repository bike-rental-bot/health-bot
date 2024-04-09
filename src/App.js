import './App.scss';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { useEffect, useState } from 'react';
// import { useUser } from './hooks/user';
import AppRoutes from './AppRoutes';
import { post } from './lib/api';
import svg from './assets/images/loader.svg';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from './redux/userSlice';
import { setAppState } from './redux/appSlice';

const WebApp = window.Telegram.WebApp;

function App() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const params = new URLSearchParams(window.location.search);
	const token = params.get('token');
	const chatId = window?.Telegram?.WebApp?.initDataUnsafe?.query_id;

	if (token && window.localStorage) {
		window.localStorage.setItem('auth_token', token);
	}

	if (WebApp) {
		WebApp.expand();
		WebApp.enableClosingConfirmation();
		WebApp?.BackButton?.show();
	}

	console.log(WebApp);

	useEffect(() => {
		if (WebApp.initData) {
			post('/users/loginByInitData', {}, decodeURIComponent(WebApp.initData))
				.then((data) => {
					dispatch(setUserInfo(data));

					if (data.user.role === 'user') {
						navigate('/admin');
					}
				})
				.catch(() => {
					navigate('/block');
				});
		} else {
			navigate('/admin');
		}
	}, [WebApp.initData]);

	if (WebApp) {
		WebApp.expand();
		WebApp.enableClosingConfirmation();
	}

	useEffect(() => {
		const viewportChanged = (e) => {
			if (e.isStateStable) {
				requestAnimationFrame(() => {
					let obj = {
						isOpenKeyboard: window.innerHeight > WebApp.viewportHeight ? true : false,
						viewPort: WebApp.viewportHeight,
					};

					dispatch(setAppState(obj));
				});
			} else {
				let obj = {
					viewPort: WebApp.viewportHeight,
				};
				dispatch(setAppState(obj));
			}
		};
		WebApp.onEvent('viewportChanged', viewportChanged);

		return () => WebApp.offEvent('viewportChanged', viewportChanged);
	}, []);

	return (
		<>
			<AppRoutes />
		</>
	);
}

export default App;
