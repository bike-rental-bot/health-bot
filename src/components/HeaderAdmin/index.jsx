import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';

const HeaderAdmin = ({ onClickCreateEvent, onClickPreview }) => {
	return (
		<div className={`${styles.container} container`}>
			<h2>Новое событие</h2>

			<button
				onClick={() => {
					if (typeof onClickCreateEvent === 'function') {
						onClickCreateEvent();
					}
				}}>
				Создать
			</button>
		</div>
	);
};

export default HeaderAdmin;
