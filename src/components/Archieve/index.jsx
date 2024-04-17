import AdminEventItem from '../UI/AdminEventItem';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { get } from '../../lib/api.js';
import { useSelector } from 'react-redux';
import { formatTime } from '../../functions.js';
import { searchByNotify } from '../../functions.js';

const TYPESMAP = {
	nutrition: 'food',
	preparations: 'drugs',
	day_regime: 'activity',
};

const Archieve = ({ notifyList, copyClick, setNotifyList }) => {
	const token = useSelector((state) => state.user?.token);
	useEffect(() => {
		searchByNotify(token, '', setNotifyList);
	}, [token]);

	return (
		<div className="container">
			{<h3 className={styles.recent}>Недавние</h3>}

			<div className={styles.events}>
				{Array.isArray(notifyList) &&
					notifyList.map((el) => {
						return (
							<AdminEventItem
								title={el.notify?.title}
								description={el.notify?.description}
								images={el.notify?.attachments}
								type={TYPESMAP[el.notify.type]}
								time={formatTime(el.time)}
								preview_url={el.notify?.preview_url}
								copyClick={copyClick}
								key={`${el.id} ${el.time}`}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default Archieve;
