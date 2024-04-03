import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import './App.scss';
import MyDatePicker from './components/UI/MyDatePicker';
import MainPage from './pages/main/mainPage';
import AdminPage from './pages/admin/adminPage';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useEffect } from 'react';

function App() {
	const WebApp = window.Telegram.WebApp;

	if (WebApp) {
		WebApp.expand();
		WebApp.enableClosingConfirmation();
	}

	// useEffect(() => {
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
	return (
		<Provider store={store}>
			<Routes>
				<Route exact path={''} element={<MainPage />} />
				<Route exact path={'/admin'} element={<AdminPage />} />
			</Routes>
		</Provider>
	);
}

export default App;
