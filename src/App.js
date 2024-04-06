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

const WebApp = window.Telegram.WebApp;

function App() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const params = new URLSearchParams(window.location.search);
	const token = params.get('token');
	const chatId = window?.Telegram?.WebApp?.initDataUnsafe?.query_id;

	console.log(window.Telegram);

	if (token && window.localStorage) {
		window.localStorage.setItem('auth_token', token);
	}

	if (WebApp) {
		WebApp.expand();
		WebApp.enableClosingConfirmation();
		WebApp?.BackButton?.show();
	}

	useEffect(() => {
		if (WebApp.initData) {
			post('/users/loginByInitData', {}, decodeURIComponent(WebApp.initData))
				.then((data) => {
					console.log('data', data);

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

	return (
		<>
			<AppRoutes />
		</>
	);
}

// 	const overflow = 1;
// 	document.body.style.overflowY = 'hidden';
// 	document.body.style.marginTop = `${overflow}px`;
// 	document.body.style.height = window.innerHeight + overflow + 'px';
// 	document.body.style.paddingBottom = `${overflow}px`;
// 	window.scrollTo(0, overflow);
// 	const root = document.getElementById('root');

// 	let ts;
// 	const onTouchStart = (e) => {
// 		ts = e.touches[0].clientY;
// 	};
// 	const onTouchMove = (e) => {
// 		if (root) {
// 			const scroll = root.scrollTop;
// 			const te = e.changedTouches[0].clientY;
// 			if (scroll <= 0 && ts < te) {
// 				e.preventDefault();
// 			}
// 		} else {
// 			e.preventDefault();
// 		}
// 	};
// 	// document.documentElement.addEventListener('touchstart', onTouchStart, { passive: false });
// 	// document.documentElement.addEventListener('touchmove', onTouchMove, { passive: false });
// }, []);

export default App;
