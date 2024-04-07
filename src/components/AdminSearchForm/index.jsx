import { useEffect, useRef } from 'react';
import ArrowLeft from '../Icons/ArrowLeft';
import SearchSVG from '../Icons/Search';
import styles from './style.module.scss';

const AdminSearchForm = ({ containerRef, clickBackBtn, sendSearch }) => {
	const searchInputRef = useRef(null);

	useEffect(() => {
		if (searchInputRef?.current) {
			searchInputRef.current.focus();
		}
	}, []);
	return (
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
					<input type={'search'} ref={searchInputRef} />
					<button type="submit">
						<SearchSVG stroke="#7F7F84" width={16} height={16} />
					</button>
				</label>
			</div>
		</form>
	);
};

export default AdminSearchForm;
