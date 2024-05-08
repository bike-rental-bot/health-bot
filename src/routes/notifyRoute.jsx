import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { get } from '../lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import loaderSvg from '../assets/images/loader.svg';
import NotifyPage from '../pages/notifyPage/notifyPage';
import { formatTime } from '../functions';
const TYPESMAP = {
	nutrition: 'food',
	preparations: 'drugs',
	day_regime: 'activity',
};

const NotifyRoute = () => {
	const [notify, setNotify] = useState({ info: null, loading: true, error: false });
	const userInfoLoading = useSelector((state) => state.user.loading);
	const userToken = useSelector((state) => state.user.token);
	const role = useSelector((state) => state.user.user?.role);
	const navigate = useNavigate();

	let { notify_id } = useParams();

	useEffect(() => {
		if (!userInfoLoading && userToken && role) {
			get('/notify/getById', {
				token: userToken,
				notify_id: notify_id,
			})
				.then((res) => {
					let notify = { info: res, loading: false };
					setNotify(notify);
				})
				.catch(() => {
					let not = { info: null, loading: false, error: true };
					if (role === 'admin' || role === 'owner') {
						navigate('/admin_panel');
					}
					if (role === 'user') {
						navigate('/');
					}
					setNotify(not);
				});
		}
	}, [userInfoLoading, userToken, role]);

	if (notify.loading) {
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
		if (!notify?.error) {
			return (
				<NotifyPage
					description={notify?.info?.notify?.description}
					time={formatTime(notify.info.time)}
					calendarDate={notify.info.time}
					title={notify?.info?.notify?.title}
					attachments={notify?.info?.notify?.attachments}
					preview_url={notify?.info?.notify?.preview_url}
					is_completed={notify?.info?.is_completed}
					type={TYPESMAP[notify?.info?.notify?.type]}
					id={notify_id}
				/>
			);
		}
	}
};

export default NotifyRoute;
