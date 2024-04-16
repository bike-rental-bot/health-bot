import { useEffect, useRef } from 'react';
import ArrowLeft from '../Icons/ArrowLeft';
import SearchSVG from '../Icons/Search';
import styles from './style.module.scss';
import { createPortal } from 'react-dom';
import { get } from '../../lib/api';
import { useSelector } from 'react-redux';

const WebApp = window.Telegram.WebApp;

const AdminSearchForm = ({
	containerRef,
	clickBackBtn,
	sendSearch,
	onFocus,
	onBlur,
	searchInputRef,
	togglerRef,
	className,
}) => {
	useEffect(() => {
		if (searchInputRef?.current) {
			searchInputRef.current.focus();
		}
	}, []);

	const token = useSelector((state) => state.user.token);

	const openKeyboard = useSelector((state) => state.app.isOpenKeyboard);

	// useEffect(() => {
	// 	WebApp.onEvent('viewportChanged', (e) => {
	// 		if (searchInputRef?.current && e.isStateStable) {
	// 			const root = document.getElementById('root');

	// 			if (togglerRef) {
	// 				if (openKeyboard) {
	// 					requestAnimationFrame(() => {
	// 						root.scrollTo({ top: 0 });
	// 					});
	// 				}
	// 			}
	// 		}
	// 	});
	// }, [openKeyboard]);

	const formSubmit = (e) => {
		e.preventDefault();
		if (searchInputRef) {
			searchInputRef.current.blur();
		}

		if (typeof sendSearch === 'function' && searchInputRef?.current?.value) {
			get('/notify/searchByNotify', { token: token, q: searchInputRef.current.value })
				.then((res) => {
					sendSearch(res);
				})
				.catch(() => {});
		}
	};

	useEffect(() => {
		if (typeof sendSearch === 'function') {
			get('/notify/searchByNotify', { token: token, q: '' })
				.then((res) => {
					sendSearch(res);
				})
				.catch(() => {});
		}
	}, []);
	return (
		<>
			<form
				onSubmit={formSubmit}
				ref={containerRef}
				className={`${styles.searchInput} ${className}`}>
				<div className={`container ${styles.container}`}>
					<button
						type="button"
						onClick={() => {
							if (searchInputRef) {
								searchInputRef.current.blur();
							}
							if (typeof clickBackBtn === 'function') {
								clickBackBtn();
							}
						}}>
						<ArrowLeft />
					</button>

					<label>
						<input
							type={'search'}
							enterKeyHint="search"
							onFocus={(e) => {
								if (onFocus === 'function') {
									onFocus();
								}

								const root = document.getElementById('root');


							}}
							onBlur={() => {
								if (typeof onBlur === 'function') onBlur();

								const root = document.getElementById('root');
 
							}}
							ref={searchInputRef}
						/>
						<button type="submit">
							<SearchSVG stroke="#7F7F84" width={16} height={16} />
						</button>
					</label>
				</div>
			</form>
		</>
	);
};

export default AdminSearchForm;
