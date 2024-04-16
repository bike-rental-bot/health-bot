import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';
import { useRef, useEffect } from 'react';
import { EVENTTYPES } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { setFormState } from '../../redux/adminSlice';
import { createPortal } from 'react-dom';
const AdminTogglerNotify = ({ clickSearch }) => {
	const indicatorTextareaRef = useRef(null);
	const dispatch = useDispatch();
	const formState = useSelector((state) => state.admin.formState);

	useEffect(() => {
		if (formState.type === EVENTTYPES[0] && indicatorTextareaRef?.current) {
			indicatorTextareaRef.current.style.left = '0px';
			indicatorTextareaRef.current.style.right = '0px';
			indicatorTextareaRef.current.style.transform = 'translateX(2px)';
		}

		if (formState.type === EVENTTYPES[1] && indicatorTextareaRef?.current) {
			indicatorTextareaRef.current.style.left = '0px';
			indicatorTextareaRef.current.style.right = '0px';
			indicatorTextareaRef.current.style.transform = 'translateX(100%)';
		}

		if (formState.type === EVENTTYPES[2] && indicatorTextareaRef?.current) {
			indicatorTextareaRef.current.style.transform = 'translateX(200%)';
			indicatorTextareaRef.current.style.left = '-2px';
			indicatorTextareaRef.current.style.right = '0px';
		}
	}, [formState]);

	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.toggler}>
					<label>
						<input
							onChange={() => {
								dispatch(setFormState({ ...formState, type: EVENTTYPES[0] }));
							}}
							type={'radio'}
							checked={formState.type === EVENTTYPES[0]}
							value={0}
							name={'adminTypeEvent'}
						/>
						<span>Питание</span>
					</label>

					<label>
						<input
							onChange={() => {
								dispatch(setFormState({ ...formState, type: EVENTTYPES[1] }));
							}}
							type={'radio'}
							name={'adminTypeEvent'}
							checked={formState.type === EVENTTYPES[1]}
						/>
						<span>Витамины</span>
					</label>

					<label>
						<input
							onChange={(value) => {
								dispatch(setFormState({ ...formState, type: EVENTTYPES[2] }));
							}}
							type={'radio'}
							value={2}
							name={'adminTypeEvent'}
							checked={formState.type === EVENTTYPES[2]}
						/>
						<span>Активность</span>
					</label>

					<span ref={indicatorTextareaRef} className={styles.indicator}></span>
				</div>
			</div>

			<button type="button" onClick={clickSearch} className={styles.searchBtn}>
				<SearchSVG />
			</button>
		</footer>
	);
};

export default AdminTogglerNotify;
