import ArrowLeft from './../../components/Icons/ArrowLeft';
import ArrowSVG from './../../components/Icons/Arrow';
import styles from './styles.module.scss';
import LinkPreview from './../../components/UI/LinkPreview/index';
import ImageLoadPreview from './../../components/ImageLoadPreview/index';
import img from '../../assets/images/tgImg.png';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
const NotifyPage = () => {
	const [stateBlocks, setStateBlocks] = useState({ text: false, attachment: false });

	const textRef = useRef(null);
	const attachmentRef = useRef(null);

	useEffect(() => {
		if (stateBlocks.text) {
			if (textRef.current) {
				textRef.current.style.height = `${textRef.current.scrollHeight}px`;
				textRef.current.style.margin = ``;
			}
		} else {
			if (textRef.current) {
				textRef.current.style.height = `0px`;
				textRef.current.style.margin = `0px`;
			}
		}

		if (stateBlocks.attachment) {
			if (attachmentRef.current) {
				attachmentRef.current.style.height = `${attachmentRef.current.scrollHeight}px`;
				attachmentRef.current.style.margin = ``;
			}
		} else {
			if (attachmentRef.current) {
				attachmentRef.current.style.height = `0px`;
				attachmentRef.current.style.margin = `0px`;
			}
		}
	}, [stateBlocks]);
	return (
		<div className={`container ${styles.container}`}>
			<button className={styles.backBtn}>
				<ArrowSVG width={10} height={10} style={{ transform: 'rotate(90deg)' }} />{' '}
				<span>Назад</span>
			</button>

			<div className={`${styles.notify}`}>
				<div>Завтрак</div>
				<div>09:00</div>
			</div>

			<div className={styles.info}>
				<div className={styles.block}>
					<button onClick={() => setStateBlocks({ ...stateBlocks, text: !stateBlocks.text })}>
						Текст <ArrowSVG className={stateBlocks.text && styles.active} width={20} height={20} />
					</button>

					<div className={styles.infoBlock} ref={textRef}>
						Lorem ipsum dolor sit amet consectetur. Egestas elementum vitae tincidunt ultrices at
						augue tempus urna in. Phasellus nunc suspendisse nulla viverra mi erat dui amet.
						Tincidunt sed vel curabitur sit semper pharetra lacus fames. Metus ipsum tincidunt
						mattis urna.
					</div>
				</div>

				<div className={styles.block}>
					<button
						onClick={() => setStateBlocks({ ...stateBlocks, attachment: !stateBlocks.attachment })}>
						Вложение{' '}
						<ArrowSVG className={stateBlocks.attachment && styles.active} width={20} height={20} />
					</button>

					<div className={styles.infoBlock} ref={attachmentRef}>
						<LinkPreview
							className={styles.linkPreview}
							type="food"
							image={img}
							siteName={'Telegraph'}
						/>

						<div className={styles.imgList}>
							<ImageLoadPreview src={img} />
							<ImageLoadPreview src={img} />
							<ImageLoadPreview src={img} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotifyPage;
