import AdminEventItem from '../UI/AdminEventItem';
import styles from './styles.module.scss';
import { useEffect, useState, useRef } from 'react';
import { get } from '../../lib/api.js';
import { useSelector } from 'react-redux';
import { formatTime } from '../../functions.js';
import { searchByNotify } from '../../functions.js';
import { TYPESMAP as REVTYPESMAP } from '../../config.js';

const TYPESMAP = {
	nutrition: 'food',
	preparations: 'drugs',
	day_regime: 'activity',
};

const firstLimit = 25;

const Archieve = ({ copyClick, searchValue }) => {
	const token = useSelector((state) => state.user?.token);
	const type = useSelector((state) => state.admin?.formState.type);
	const [notifyList, setNotifyList] = useState({ nutrition: [], preparations: [], day_regime: [] });
	const [offset, setOffset] = useState({ nutrition: 0, preparations: 0, day_regime: 0 });
	const containerRef = useRef();
	const scrollPositions = useRef({ nutrition: 0, preparations: 0, day_regime: 0 });

	useEffect(() => {
		const parentEl = containerRef?.current?.parentNode;

		if (parentEl) parentEl.scrollTo(0, 0);
		get('/notify/searchByNotify', {
			token,
			q: searchValue,
			notify_type: 'nutrition',
			limit: firstLimit,
			offset: 0,
		})
			.then((res) => {
				setNotifyList((prev) => {
					return { ...prev, nutrition: res.result };
				});

				setOffset((prev) => {
					return { ...prev, nutrition: firstLimit };
				});
			})
			.catch(() => {});

		get('/notify/searchByNotify', {
			token,
			q: searchValue,
			notify_type: 'preparations',
			limit: firstLimit,
			offset: 0,
		})
			.then((res) => {
				setNotifyList((prev) => {
					return { ...prev, preparations: res.result };
				});

				setOffset((prev) => {
					return { ...prev, preparations: firstLimit };
				});
			})
			.catch(() => {});

		get('/notify/searchByNotify', {
			token,
			q: searchValue,
			notify_type: 'day_regime',
			limit: firstLimit,
			offset: 0,
		})
			.then((res) => {
				setNotifyList((prev) => {
					return { ...prev, day_regime: res.result };
				});
				setOffset((prev) => {
					return { ...prev, day_regime: firstLimit };
				});
			})
			.catch(() => {});
	}, [searchValue]);

	useEffect(() => {
		const parentEl = containerRef?.current?.parentNode;
		let zap = false;

		function scroll() {
			const element = document.querySelector(`[data-index="${offset[type] - 3}"]`);

			scrollPositions.current[type] = parentEl.scrollTop;

			if (parentEl && element) {
				const scrollPosition = parentEl.scrollHeight - parentEl.clientHeight - parentEl.scrollTop;

				if (scrollPosition < 5 && !zap) {
					zap = true;
					get('/notify/searchByNotify', {
						token,
						q: searchValue,
						notify_type: type,
						limit: 10,
						offset: offset[type],
					})
						.then((res) => {
							setNotifyList((prev) => {
								return { ...prev, [type]: [...prev[type], ...res.result] };
							});

							setOffset((prev) => {
								return { ...prev, [type]: prev[type] + 10 };
							});
						})
						.catch(() => {});
				}
			}
		}
		if (parentEl) {
			parentEl.addEventListener('scroll', scroll);
		}

		return () => {
			if (parentEl) {
				parentEl.removeEventListener('scroll', scroll);
			}
		};
	}, [offset, type]);

	useEffect(() => {
		const parentEl = containerRef?.current?.parentNode;
		if (parentEl) parentEl.scrollTo(0, scrollPositions.current[type]);
	}, [type]);

	return (
		<div ref={containerRef} className="container">
			{<h3 className={styles.recent}>Недавние</h3>}

			<div className={styles.events}>
				{Array.isArray(notifyList[type]) &&
					notifyList[type].map((el, index) => {
						return (
							<AdminEventItem
								index={index}
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
