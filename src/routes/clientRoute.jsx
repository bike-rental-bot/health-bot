import { useSelector } from 'react-redux';
import loaderSvg from '../assets/images/loader.svg';
import { Navigate, useNavigate } from 'react-router-dom';
import MainPage from '../pages/main/mainPage';
const ClientRoute = () => {
	const loading = useSelector((state) => state.user.loading);
	const user = useSelector((state) => state.user.user);
	const navigate = useNavigate();
	const patient_id = useSelector((state) => state.admin.formState.user_id);


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
		if (user.role === 'admin' || user.role === 'owner') {
			if (!patient_id) {
				return <Navigate to={'/admin_panel'} />;
			} else {
				return <MainPage />;
			}
		}
		return <MainPage />;
	}
};

export default ClientRoute;
