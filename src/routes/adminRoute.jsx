import { useSelector } from 'react-redux';
import loaderSvg from '../assets/images/loader.svg';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../pages/admin/adminPage';

const AdminRoute = () => {
	const loading = useSelector((state) => state.user.loading);
	const user = useSelector((state) => state.user.user);
	const navigate = useNavigate();

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
			return <AdminPage />;
		}
	}
};

export default AdminRoute;
