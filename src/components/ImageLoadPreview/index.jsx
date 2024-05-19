import styles from './styles.module.scss';
import DeleteButton from './../UI/DeleteButton/index';
const ImageLoadPreview = ({ src, clickDelete, alt, className, imgContainerClassName }) => {
	return (
		<div className={`${styles.container} ${className}`}>
			<div className={`${styles.imgContainer} ${imgContainerClassName}`}>
				<img src={src} alt={alt} />

				{clickDelete && <DeleteButton onClick={clickDelete} />}
			</div>
		</div>
	);
};

export default ImageLoadPreview;
