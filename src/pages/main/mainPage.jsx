import styles from './styles.module.scss';
import TimeToggle from '../../components/TimeToggle';
import { useEffect, useRef } from 'react';
import NotifyToggle from '../../components/NotifyToggle';
import BottomButton from '../../components/UI/BottomButton';
import Modal from '../../components/UI/Modal';
import NotifyDescription from '../../components/NotifyDescription';
import { get } from '../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { setEventsLoading, setListEvent } from '../../redux/clientSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setPatientsEvents, setPatientsEventsLoading } from '../../redux/adminSlice';

const MainPage = () => {
	const WebApp = window.Telegram.WebApp;
	const navigate = useNavigate();
	const [calendarDate, setCalendarDate] = useState(new Date());
	const token = useSelector((state) => state.user.token);
	const dispatch = useDispatch();

	const events = useSelector((state) => state.client);

	const patientEvents = useSelector((state) => state.admin.patientsEvents);
	const patientToken = useSelector((state) => state.admin.formState.token);

	const userInfo = useSelector((state) => state.user);

	const { loading } = useSelector((state) => state.client);

	useEffect(() => {
		if (userInfo?.user?.role === 'admin') {
			WebApp.MainButton.setParams({
				text: 'Вернуться в админ-панель',
				color: '#3192fd',
			}).show();
		}

		if (userInfo?.user?.role === 'user') {
			WebApp.MainButton.setParams({
				text: 'Задать вопрос',
				color: '#3192fd',
			}).show();
		}

		function clickMainBtn() {
			if (userInfo?.user?.role === 'admin') navigate('/admin');

			if (userInfo?.user?.role === 'user') WebApp.openTelegramLink('https://t.me/olegin_m');
		}

		WebApp.onEvent('mainButtonClicked', clickMainBtn);

		return () => {
			WebApp.offEvent('mainButtonClicked', clickMainBtn);
		};
	}, [userInfo]);

	useEffect(() => {
		if (userInfo?.user?.role === 'user') {
			if (!events[calendarDate.toISOString().slice(0, 10)] && token) {
				dispatch(setEventsLoading(true));

				get('/notify/getByDate', {
					token: token,
					date: calendarDate.toISOString().slice(0, 10),
				})
					.then((res) => {
						const obj = { date: calendarDate.toISOString().slice(0, 10), info: res.result };
						dispatch(setListEvent(obj));
					})
					.catch(() => {
						dispatch(setListEvent());
					});
			}
		}

		if (userInfo?.user?.role === 'admin') {
			if (
				(!patientEvents[patientToken] ||
					!patientEvents[patientToken][calendarDate.toISOString().slice(0, 10)]) &&
				patientToken
			) {
				dispatch(setPatientsEventsLoading(true));

				get('/notify/getByDate', {
					token: patientToken,
					date: calendarDate.toISOString().slice(0, 10),
				})
					.then((res) => {
						const obj = {
							date: calendarDate.toISOString().slice(0, 10),
							result: res.result,
							token: patientToken,
						};
						dispatch(setPatientsEvents(obj));
						dispatch(setPatientsEventsLoading(false));
					})
					.catch(() => {
						dispatch(setPatientsEvents());
						dispatch(setPatientsEventsLoading(false));
					});
			}
		}
	}, [calendarDate, token, patientToken]);

	useEffect(() => {
		const root = document.getElementById('root');

		root.style.paddingBottom = '0px';
	}, []);
	return (
		<>
			<div className={styles.containerHeader}>
				<TimeToggle calendarDate={calendarDate} setCalendarDate={setCalendarDate} />
				<NotifyToggle calendarDate={calendarDate} />
			</div>

			{/* <BottomButton /> */}
		</>
	);
};

export default MainPage;
