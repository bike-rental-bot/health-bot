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

const MainPage = () => {
	const WebApp = window.Telegram.WebApp;
	const navigate = useNavigate();
	const [calendarDate, setCalendarDate] = useState(new Date());
	const token = useSelector((state) => state.user.token);
	const dispatch = useDispatch();

	const events = useSelector((state) => state.client);

	const userInfo = useSelector((state) => state.user);

	const { loading } = useSelector((state) => state.client);

	useEffect(() => {
		if (userInfo?.user?.role === 'admin') {
			WebApp.MainButton.setText('Вернуться в админ-панель').show();
		}

		if (userInfo?.user?.role === 'user') {
			WebApp.MainButton.setText('Задать вопрос').show();
		}
		function clickCloseBtn() {
			const tagName = document.activeElement.tagName.toLowerCase();

			if (tagName === 'textarea' || tagName === 'input') {
				document.activeElement.blur();
			}

			requestAnimationFrame(() => {
				WebApp.showPopup(
					{
						title: 'health_bot',
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

		function clickMainBtn() {
			if (userInfo?.user?.role === 'admin') navigate('/admin');

			if (userInfo?.user?.role === 'user') WebApp.openTelegramLink('https://t.me/olegin_m');
		}
		WebApp.onEvent('backButtonClicked', clickCloseBtn);
		WebApp.onEvent('mainButtonClicked', clickMainBtn);

		return () => {
			WebApp.offEvent('backButtonClicked', clickCloseBtn);
			WebApp.offEvent('mainButtonClicked', clickMainBtn);
		};
	}, []);

	useEffect(() => {
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
	}, [calendarDate, token]);
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
