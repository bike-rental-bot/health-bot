import { useSelector } from 'react-redux';
import loaderSvg from '../assets/images/loader.svg';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../pages/admin/adminPage';
import AdminPageIOS from '../pages/admin/adminPageIOS';
import { useEffect } from 'react';

const WebApp = window.Telegram.WebApp;

const AdminRoute = () => {
	const loading = useSelector((state) => state.user.loading);
	const user = useSelector((state) => state.user.user);
	const navigate = useNavigate();

	useEffect(() => {
		function clickCloseBtn() {
			const tagName = document.activeElement.tagName.toLowerCase();

			if (tagName === 'textarea' || tagName === 'input') {
				document.activeElement.blur();
			}

			requestAnimationFrame(() => {
				WebApp.showPopup(
					{
						title: 'Ecopulse',
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

	if (loading) {
		return (
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
		);
	} else {
		if (user.role === 'user') {
			navigate('/');
			return null;
		}
		if (user.role === 'admin' || user.role === 'owner') {
			return <>{WebApp.platform === 'ios' ? <AdminPageIOS /> : <AdminPage />}</>;
		}
	}
};

export default AdminRoute;
