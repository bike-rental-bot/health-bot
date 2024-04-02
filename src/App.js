import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import './App.scss';
import MyDatePicker from './components/UI/MyDatePicker';
import MainPage from './pages/main/mainPage';
import AdminPage from './pages/admin/adminPage';

function App() {
	const WebApp = window.Telegram.WebApp;

	if (WebApp) {
		WebApp.expand();
		WebApp.enableClosingConfirmation();
	}
	return (
		<Routes>
			<Route exact path={''} element={<MainPage />} />
			<Route exact path={'/admin'} element={<AdminPage />} />
		</Routes>
	);
}

export default App;
