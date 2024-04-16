import './App.scss';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { useEffect, useState } from 'react';
// import { useUser } from './hooks/user';
import AppRoutes from './AppRoutes';
import { get, post } from './lib/api';
import svg from './assets/images/loader.svg';
import { useNavigate } from 'react-router-dom';
import { setUserError, setUserInfo, setUserLoading } from './redux/userSlice';
import { setAppState } from './redux/appSlice';
import { setPatients } from './redux/adminSlice';
import AdminPageIOS from './pages/admin/adminPageIOS';

const WebApp = window.Telegram.WebApp;

function App() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const params = new URLSearchParams(window.location.search);
	const token = params.get('token');
	const [status, setStatus] = useState('');
	const viewport = useSelector((state) => state.app.viewPort);
	const openKeyboard = useSelector((state) => state.app.isOpenKeyboard);
	const root = document.getElementById('root');
	const [scrollPos, setScrollPos] = useState(0);
	const [wScrollPos, setWScrollPos] = useState(0);

	if (WebApp) {
		WebApp.expand();
		WebApp.enableClosingConfirmation();
		WebApp?.BackButton?.show();
	}

	useEffect(() => {
		function clickCloseBtn() {
			const tagName = document.activeElement.tagName.toLowerCase();

			if (tagName === 'textarea' || tagName === 'input') {
				document.activeElement.blur();
			}

			requestAnimationFrame(() => {
				WebApp.showPopup(
					{
						title: 'health_bot',
						message: 'Внесенные изменения могут быть потеряны',
						buttons: [
							{ id: 'close', type: 'destructive', text: 'Закрыть' },
							{ id: 'cancel', type: 'cancel', text: 'Отмена' },
						],
					},
					(id) => {
						if (id === 'close') {
							WebApp.close();
						}
					},
				);
			});
		}

		WebApp.onEvent('backButtonClicked', clickCloseBtn);

		return () => {
			WebApp.offEvent('backButtonClicked', clickCloseBtn);
		};
	}, []);

	useEffect(() => {
		if (WebApp.initData) {
			post('/users/loginByInitData', {}, decodeURIComponent(WebApp.initData))
				.then((data) => {
					dispatch(setUserInfo(data));
					dispatch(setUserLoading(false));
				})
				.catch((err) => {
					navigate('/block');
					dispatch(setUserLoading(false));
					dispatch(setUserError(true));
					setStatus(`server error ${err}`);
				});
		} else {
			navigate('/block');
			setStatus(`empty InitData`);
		}
	}, []);

	useEffect(() => {
		if (user?.user?.role === 'admin' && user?.token) {
			get('/users/getAdminUsers', { token: user.token }).then((data) => {
				dispatch(setPatients(data.users));
			});
		}
	}, [user]);

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
					isOpenKeyboard: false,
				};
				dispatch(setAppState(obj));
			}
		};
		WebApp.onEvent('viewportChanged', viewportChanged);

		return () => {
			WebApp.offEvent('viewportChanged', viewportChanged);
		};
	}, []);

	return (
		<>
			<AppRoutes />
{/* 
			<AdminPageIOS /> */}
		</>
	);
}

export default App;
