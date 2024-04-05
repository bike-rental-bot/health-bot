import styles from './styles.module.scss';
import linkIMG from '../../../assets/images/tgImg.png';
import BoltSVG from '../../Icons/Bolt';
import { useEffect, useState } from 'react';

const webApp = window?.Telegram?.WebApp;

const LinkPreview = ({
	type = 'food',
	href,
	className,
	titleClassName,
	style,
	title,
	image,
	siteName,
}) => {
	return (
		<>
			<div
				onClick={() => {
					webApp.openLink(href);
				}}
				style={style}
				className={`${styles.container} ${styles.block} ${styles[type]} ${className}`}>
				<div className={`${styles[type]} ${styles.siteName}`}>Telegraph</div>
				<p className={titleClassName}>{title}</p>
				{image && (
					<div className={styles.img}>
						<img src={image} alt={'tgImg'} />
					</div>
				)}

				<div className={`${styles.watch} ${styles[type]} `}>
					<BoltSVG /> ПОСМОТРЕТЬ
				</div>
			</div>
		</>
	);
};

export default LinkPreview;
