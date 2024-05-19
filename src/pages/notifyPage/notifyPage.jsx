import ArrowLeft from './../../components/Icons/ArrowLeft';
import ArrowSVG from './../../components/Icons/Arrow';
import styles from './styles.module.scss';
import LinkPreview from './../../components/UI/LinkPreview/index';
import ImageLoadPreview from './../../components/ImageLoadPreview/index';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { TYPESMAP } from '../../config';
import { setEventComplete } from '../../redux/clientSlice';

const regexLink = new RegExp(
	'^(https?:\\/\\/)?' + // Протокол (http:// или https://)
		'(?:www\\.)?telegra\\.ph' + // Доменное имя telegra.ph
		'(\\/[\\w\\d-._~%]*)*' + // Путь
		'(\\?[;&=a-z\\d%_.~+-]*)?' + // Query string
		'(#[a-z\\d-._~]*)?$', // Anchor ссылка
	'i',
);

const COLORMAP = {
	food: '#ff8551',
	drugs: '#00c187',
	activity: '#9747ff',
};

const WebApp = window.Telegram.WebApp;
const NotifyPage = ({
	description,
	attachments,
	preview_url,
	title,
	time,
	id,
	calendarDate,
	type = 'food',
	is_completed,
}) => {
	const dispatch = useDispatch();
	const [stateBlocks, setStateBlocks] = useState({ text: true, attachment: true });
	const [metaData, setMetaData] = useState({ info: null, loading: true });
	const userToken = useSelector((state) => state.user.token);
	const role = useSelector((state) => state.user.user.role);
	const [completeClick, setCompleteClick] = useState(is_completed);


	const clientEvents = useSelector((state) => state.client);

	const textRef = useRef(null);
	const attachmentRef = useRef(null);
	const navigate = useNavigate();

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

	useEffect(() => {
		if (regexLink.test(preview_url)) {
			fetch(`https://impulsrent.ru:8203/api/notify/getTelegraphData?url=${preview_url}`)
				.then((res) => res.json())
				.then((res) => {
					const obj = {
						info: res,
						loading: false,
					};
					setMetaData(obj);
				})
				.catch((err) => {
					setMetaData({ info: null, loading: false });
				});
		} else {
			setMetaData({ info: null, loading: false });
		}
	}, [preview_url]);



	const mainBtnClick = () => {
		if (role === 'user' && !completeClick) {
			get('/notify/completeNotify', { task_id: id, token: userToken }).then((res) => {
				WebApp.HapticFeedback.notificationOccurred('success');
				if (
					clientEvents[calendarDate.slice(0, 10)] &&
					clientEvents[calendarDate.slice(0, 10)][TYPESMAP[type]]
				) {
					let obj = {
						date: calendarDate.slice(0, 10),
						id: id,
						type: TYPESMAP[type],
					};
					dispatch(setEventComplete(obj));
					setCompleteClick(true);

					setTimeout(()=> {
						navigate(-1);
					}, 2000)
				}
			}).catch((err) => {
					WebApp.HapticFeedback.notificationOccurred('error');
			});
		}
		else{
			WebApp.HapticFeedback.notificationOccurred('error');
		}
	};

	useEffect(() => {
		document.body.style.background = '#f6f6f6';

		if (role === 'admin' || role === 'owner') {
			WebApp.MainButton.setParams({
				text: 'Вернуться в админ-панель',
				color: '#3192fd',
			}).show();
		}
		else{
			WebApp.MainButton.setParams({
				text: 'Задать вопрос',
				color: '#3192fd',
			}).show();
		}

		const mainBtnClick = () => {
			if (role === 'admin' || role === 'owner') 
				navigate('/admin_panel');
			else
				WebApp.openTelegramLink('https://t.me/olegin_m');
		}
		

	    WebApp.BackButton.hide();

		WebApp.onEvent('mainButtonClicked', mainBtnClick);

		return () => WebApp.offEvent('mainButtonClicked', mainBtnClick);
	}, []);

	return (
		<div className={`container ${styles.container}`}>
			<div className={`${styles.notify}`}>
				<div>{title}</div>
				<div>{time}</div>
			</div>

			<div className={`${styles.info} ${styles[type]}`}>
				<div className={styles.block}>
					<button onClick={() => setStateBlocks({ ...stateBlocks, text: !stateBlocks.text })}>
						Текст <ArrowSVG className={stateBlocks.text && styles.active} width={20} height={20} />
					</button>

					<div className={styles.infoBlock} ref={textRef}>
						{description.split('\n').map((el) => {
							if (el.length > 0) return <p>{el}</p>;
						})}
					</div>
				</div>

				<div className={styles.block}>
					<button
						onClick={() => setStateBlocks({ ...stateBlocks, attachment: !stateBlocks.attachment })}>
						Вложение{' '}
						<ArrowSVG className={stateBlocks.attachment && styles.active} width={20} height={20} />
					</button>

					<div className={styles.infoBlock} ref={attachmentRef}>
						{!metaData.loading && (
							<>
								{' '}
								{metaData.info ? (
									<LinkPreview
										className={styles.linkPreview}
										type={type}
										href={preview_url}
										image={metaData?.info?.image}
										title={metaData?.info?.title}
										siteName={'Telegraph'}
									/>
								) : (
									<div
										onClick={() => WebApp.openLink(preview_url, { try_instant_view: true })}
										className={styles.link}>
										{preview_url}
									</div>
								)}
							</>
						)}

						<div className={styles.imgList}>
							{Array.isArray(attachments) &&
								attachments.map((el) => {
									return <ImageLoadPreview className={styles.image} imgContainerClassName={styles.imgCont} src={el} key={el} />;
								})}
						</div>
					</div>
				</div>
			</div>

			<button
				onClick={() => {
					navigate('/');
				}}
				className={`${styles.closeBtn} ${styles[type]}`}>
				Закрыть
			</button>

			<button
				onClick={() => {
					mainBtnClick();
				}}
				className={`${styles.fullFillBtn} ${styles[type]} ${completeClick && styles.completed}`}>
				<span>{completeClick ? 'Исполнено' : 'Исполнить'}</span>
			</button>
		</div>
	);
};

export default NotifyPage;
