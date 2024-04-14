import BucketSVG from '../Icons/Bucket';
import DislikeSVG from '../Icons/Dislike';
import TickSVG from '../Icons/Tick';
import styles from './style.module.scss';
import Modal from '../UI/Modal';

import NotifyDescription from '../NotifyDescription';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from '../../lib/api';
import { setListEvent } from '../../redux/clientSlice';

const Notify = ({
	type = 'food',
	onClick,
	title,
	time,
	description,
	preview_url,
	attachments,
	is_completed,
	id,
	calendarDate,
}) => {
	const [modalActive, setModalActive] = useState(false);

	const role = useSelector((state) => state.user?.user?.role);

	const userToken = useSelector((state) => state.user.token);

	const dispatch = useDispatch();

	const closeModal = () => {
		setModalActive(false);
	};

	const fullFillClick = async () => {
		if (role === 'user') {
			get('/notify/completeNotify', { task_id: id, token: userToken }).then((res) =>
				console.log('complete', res),
			);

			get('/notify/getByDate', {
				token: userToken,
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
	};

	return (
		<>
			<div
				onClick={() => {
					setModalActive(true);
					if (typeof onClick === 'function') onClick();
				}}
				className={styles.container}>
				<div className={`${styles.header} ${styles[type]}`}>
					<span className={styles.name}>{title}</span>

					<span className={styles.time}>{time}</span>
				</div>

				<div className={styles.text}>{description}</div>

				<div className={`${styles.labelCont}`}>
					<div className={`${is_completed && styles[type]}`}>
						<TickSVG />
					</div>
				</div>
			</div>
			<Modal active={modalActive}>
				<NotifyDescription
					time={time}
					preview_url={preview_url}
					attachments={attachments}
					title={title}
					description={description}
					type={type}
					closeClick={closeModal}
					fullFillClick={fullFillClick}
					is_completed={is_completed}
				/>
			</Modal>
		</>
	);
};

export default Notify;
