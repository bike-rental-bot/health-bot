import styles from './styles.module.scss';
import closePNG from '../../../assets/images/close.png';
import { useEffect, useRef } from 'react';

const Toasify = ({ state, setState, status = 'positive', children }) => {
	const timer = useRef(null);

	useEffect(() => {
		if (state.active) {
			timer.current = setTimeout(() => {
				setState({ ...state, active: false });
			}, 5000);
		} else {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		}
        
		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, [state]);
	return (
		<div className={`${styles.container} ${state.active && styles.active} ${styles[status]}`}>
			<button onClick={() => setState({ ...state, active: false })} className={styles.closeBtn}>
				<img src={closePNG} alt="close PNG" width={8} height={8} />
			</button>
			{children}
		</div>
	);
};

export default Toasify;
