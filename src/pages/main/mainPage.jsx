import styles from './styles.module.scss';
import TimeToggle from '../../components/TimeToggle';
import { useEffect, useRef } from 'react';
import NotifyToggle from '../../components/NotifyToggle';
import BottomButton from '../../components/UI/BottomButton';
import Modal from '../../components/UI/Modal';
import NotifyDescription from '../../components/NotifyDescription';
import { get } from '../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { setListEvent } from '../../redux/clientSlice';
import { useState } from 'react';

const MainPage = () => {
	const [calendarDate, setCalendarDate] = useState(new Date());
	const token = useSelector((state) => state.user.token);
	const dispatch = useDispatch();

	const events = useSelector((state) => state.client);

	console.log('events', token);

	useEffect(() => {
		if (!events[calendarDate.toISOString().slice(0, 10)] && token) {
			get('/notify/getByDate', {
				token: token,
				date: calendarDate.toISOString().slice(0, 10),
			}).then((res) => {
				const obj = { date: calendarDate.toISOString().slice(0, 10), info: res.result };

				dispatch(setListEvent(obj));
			});
		}
	}, [calendarDate, token]);
	return (
		<>
			<div className={styles.containerHeader}>
				<TimeToggle calendarDate={calendarDate} setCalendarDate={setCalendarDate} />
			</div>
			<NotifyToggle calendarDate={calendarDate}/>
			<BottomButton />
		</>
	);
};

export default MainPage;
