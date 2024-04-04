import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';

const HeaderAdmin = ({ onClickSearch, onClickCreateEvent }) => {
	return (
		<div className={`${styles.container} container`}>
			<button
				onClick={() => {
					if (typeof onClickSearch === 'function') onClickSearch();
				}}>
				<SearchSVG />
			</button>

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
