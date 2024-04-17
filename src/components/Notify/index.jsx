import BucketSVG from '../Icons/Bucket';
import DislikeSVG from '../Icons/Dislike';
import TickSVG from '../Icons/Tick';
import styles from './style.module.scss';
import Modal from '../UI/Modal';

import NotifyDescription from '../NotifyDescription';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from '../../lib/api';
import { setListEvent, setEventComplete } from '../../redux/clientSlice';
import { TYPESMAP } from '../../config';
import { useNavigate } from 'react-router-dom';

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

	const role = useSelector((state) => state.user?.user?.role);

	const navigate = useNavigate();

	const userToken = useSelector((state) => state.user.token);

	const dispatch = useDispatch();



	return (
		<>
			<div
				onClick={() => {
					navigate(`/notify/${id}`);
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

		</>
	);
};

export default Notify;
