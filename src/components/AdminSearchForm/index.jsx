import { useEffect, useRef } from 'react';
import ArrowLeft from '../Icons/ArrowLeft';
import SearchSVG from '../Icons/Search';
import styles from './style.module.scss';
import { createPortal } from 'react-dom';

const WebApp = window.Telegram.WebApp;

const AdminSearchForm = ({
	containerRef,
	clickBackBtn,
	sendSearch,
	onFocus,
	onBlur,
	searchInputRef,
	togglerRef,
}) => {
	useEffect(() => {
		if (searchInputRef?.current) {
			searchInputRef.current.focus();
		}
	}, []);

	useEffect(() => {
		WebApp.onEvent('viewportChanged', (e) => {
			if (searchInputRef?.current && e.isStateStable) {
				const root = document.getElementById('root');

				if (togglerRef) {
					requestAnimationFrame(() => {
						root.scrollTo({ top: togglerRef.offsetTop - root.offsetTop });
					});
				}
			}
		});
	}, []);
	return (
		<>
			{createPortal(
				<form
					onSubmit={(e) => {
						e.preventDefault();

						if (searchInputRef) {
							searchInputRef.current.blur();
						}

						if (typeof sendSearch === 'function') {
							sendSearch();
						}
					}}
					ref={containerRef}
					className={styles.searchInput}>
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
								onFocus={(e) => {
									e.preventDefault();

									if (onFocus === 'function') {
										onFocus();
									}

									if (typeof onBlur === 'function') onBlur();
								}}
								ref={searchInputRef}
							/>
							<button
								onClick={(e) => {
									e.preventDefault();
								}}
								type="submit">
								<SearchSVG stroke="#7F7F84" width={16} height={16} />
							</button>
						</label>
					</div>
				</form>,
				document.body,
			)}
		</>
	);
};

export default AdminSearchForm;
