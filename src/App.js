import './App.scss';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { useEffect, useState } from 'react';
// import { useUser } from './hooks/user';
import AppRoutes from './AppRoutes';
import { get, post } from './lib/api';
import svg from './assets/images/loader.svg';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from './redux/userSlice';
import { setAppState } from './redux/appSlice';
import { setPatients } from './redux/adminSlice';

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
		if (WebApp.initData) {
			post('/users/loginByInitData', {}, decodeURIComponent(WebApp.initData))
				.then((data) => {
					dispatch(setUserInfo(data));

					if (data?.user?.role === 'admin') {
						navigate('/admin');
					}

					if (data?.user?.role === 'user') {
						navigate('/client');
					}
				})
				.catch((err) => {
					navigate('/block');
					setStatus(`server error ${err}`);
				});
		} else {
			navigate('/admin');
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

		root.addEventListener('scroll', () => {
			setScrollPos(root.scrollTop);
			setWScrollPos(window.screenTop);
		});

		return () => WebApp.offEvent('viewportChanged', viewportChanged);
	}, []);

	useEffect(() => {
		if (!openKeyboard) {
			root.scrollTo({ top: 0 });
		}
	}, [openKeyboard]);

	return (
		<>
			{/* webAPP: {WebApp.platform}
			<div>
				{' '}
				viewport: {viewport} window.innerHeight: {window.innerHeight}
			</div>
			<div style={{ height: 40 }}></div>
			<div> root: {scrollPos}</div>
			<div> window: {wScrollPos}</div> */}
			<AppRoutes />
		</>
	);
}

export default App;
