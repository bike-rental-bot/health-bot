import MainPage from './pages/main/mainPage';
import AdminPage from './pages/admin/adminPage';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import loaderSvg from './assets/images/loader.svg';
import NotifyPage from './pages/notifyPage/notifyPage';
const AppRoutes = () => {
	return (
		<Routes>
			<Route
				path="/block"
				element={
					<div
						style={{
							textAlign: 'center',
							padding: '20px',
							height: '100vh',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						Не авторизован
					</div>
				}
			/>
			<Route
				path={'/'}
				exact={true}
				element={
					<div
						style={{
							textAlign: 'center',
							padding: '20px',
							height: '100vh',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<img src={loaderSvg} alt="Loading" width={64} height={64} />
					</div>
				}
			/>
			<Route path={'/client'} element={<MainPage />} />
			<Route path={'/admin'} element={<AdminPage />} />
			<Route path={'/notify'} element={<NotifyPage />} />
		</Routes>
	);
};

export default AppRoutes;
