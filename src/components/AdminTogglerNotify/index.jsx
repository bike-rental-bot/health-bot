import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';
import { useRef, useEffect } from 'react';
import { EVENTTYPES } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { setFormState } from '../../redux/adminSlice';
const AdminTogglerNotify = ({ footerRef, clickSearch }) => {
	const indicatorTextareaRef = useRef(null);
	const dispatch = useDispatch();
	const formState = useSelector((state) => state.admin.formState);


	return (
		<>
			<footer ref={footerRef} className={styles.footer}>
				<div className={styles.container}>
					<div className={styles.toggler}>
						<label>
							<input
								onChange={() => {
									indicatorTextareaRef.current.style.left = '0px';
									indicatorTextareaRef.current.style.right = '0px';
									indicatorTextareaRef.current.style.transform = 'translateX(2px)';
									dispatch(setFormState({ ...formState, type: EVENTTYPES[0] }));
								}}
								type={'radio'}
								defaultChecked
								value={0}
								name={'adminTypeEvent'}
							/>
							<span>Питание</span>
						</label>

						<label>
							<input
								onChange={() => {
									indicatorTextareaRef.current.style.left = '0px';
									indicatorTextareaRef.current.style.right = '0px';
									indicatorTextareaRef.current.style.transform = 'translateX(100%)';

									dispatch(setFormState({ ...formState, type: EVENTTYPES[1] }));
								}}
								type={'radio'}
								value={1}
								name={'adminTypeEvent'}
							/>
							<span>Витамины</span>
						</label>

						<label>
							<input
								onChange={(value) => {
									indicatorTextareaRef.current.style.transform = 'translateX(200%)';
									indicatorTextareaRef.current.style.left = '-2px';
									indicatorTextareaRef.current.style.right = '0px';

									dispatch(setFormState({ ...formState, type: EVENTTYPES[2] }));
								}}
								type={'radio'}
								value={2}
								name={'adminTypeEvent'}
							/>
							<span>Активность</span>
						</label>

						<span ref={indicatorTextareaRef} className={styles.indicator}></span>
					</div>
				</div>

				<button onClick={clickSearch} className={styles.searchBtn}>
					<SearchSVG />
				</button>
			</footer>
		</>
	);
};

export default AdminTogglerNotify;
