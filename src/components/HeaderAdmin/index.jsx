import SearchSVG from '../Icons/Search';
import styles from './styles.module.scss';

const HeaderAdmin = ({onClickSearch}) => {
	return (
		<div className={`${styles.container} container`}>
			<button
				onClick={() => {
					if (typeof onClickSearch === 'function') onClickSearch();
				}}>
				<SearchSVG />
			</button>

			<h2>Новое событие</h2>

			<button>Создать</button>
		</div>
	);
};

export default HeaderAdmin;
