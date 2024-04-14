import MainPage from './pages/main/mainPage';
import AdminPage from './pages/admin/adminPage';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import loaderSvg from './assets/images/loader.svg';
import NotifyPage from './pages/notifyPage/notifyPage';
import ClientRoute from './routes/clientRoute';
import AdminRoute from './routes/adminRoute';
import NotifyRoute from './routes/notifyRoute';
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
			<Route path={'/'} element={<ClientRoute />} />
			<Route path={'/admin'} element={<AdminRoute />} />
			<Route path={'/notify/:notify_id'} element={<NotifyRoute />} />
		</Routes>
	);
};

export default AppRoutes;
