import AdminEventItem from '../UI/AdminEventItem';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { get } from '../../lib/api.js';
import { useSelector } from 'react-redux';
import { formatTime } from '../../functions.js';

const TYPESMAP = {
	nutrition: 'food',
	preparations: 'drugs',
	day_regime: 'activity',
};


const Archieve = ({ notifyList, copyClick, setNotifyList }) => {
	const token = useSelector((state) => state.user?.token);
	useEffect(() => {
		
		get('/notify/searchByNotify', { token: token, q: '' })
			.then((res) => {
			
				setNotifyList(res.result);
			})
			.catch(() => {});
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
								key={`${el.id} ${new Date(el.time).toISOString()}`}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default Archieve;
