import { Swiper, SwiperSlide } from 'swiper/react';
import AdminTextEditor from '../../components/AdminTextEditor';
import HeaderAdmin from '../../components/HeaderAdmin';
import MyDatePicker from '../../components/UI/MyDatePicker';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import TimePicker from '../../components/UI/TimePicker';
import useDebounce from '../../hooks/useDebounce';

const tg = window.Telegram.WebApp;

const getPosition = (parentRef, childRef) => {
	const parentRect = parentRef.current.getBoundingClientRect();
	const childRect = childRef.current.getBoundingClientRect();

	return childRect.left - parentRect.left;
};

const AdminPage = () => {
	const indicatorTextareaRef = useRef(null);
	const [date, setDate] = useState(new Date());
	const [calendarFull, setCalendarFull] = useState(false);
	const [type, setType] = useState(0);
	const swiperRef = useRef();
	const typeSwiperContRef = useRef();
	const dateRef = useRef();
	const timeRef = useRef();
	const archiveRef = useRef();
	const activityIndicatorRef = useRef();
	const firstRender = useRef(false);
	const mainRef = useRef(null);
	const searchInputRef = useRef();
	const [search, setSearch] = useState(false);

	const clickSearch = () => {
		setSearch(!search);
	};

	useEffect(() => {
		if (search) {
			if (searchInputRef && searchInputRef.current) {
				const x = window.scrollX;
				const y = window.scrollY;
				mainRef.current.style.minHeight = '149px';
				searchInputRef.current.focus();

				// requestAnimationFrame(() => {
				// 	typeSwiperContRef.current.scrollIntoView();
				// });
			}
		} else {
			mainRef.current.style.minHeight = '';
		}
	}, [search]);

	useEffect(() => {
		window.addEventListener('scroll', () => {});
	}, []);

	return (
		<>
			<div className={styles.header}>
				<HeaderAdmin onClickSearch={clickSearch} />

				<div className="container">
					<AdminTextEditor />
				</div>

				<div className={`${styles.type} ${styles.sticky}`}>
					<div ref={typeSwiperContRef} className={`container ${styles.container}`}>
						<label ref={dateRef}>
							<input
								onChange={() => {
									if (swiperRef?.current?.swiper) swiperRef.current.swiper.slideTo(0);
									else {
										activityIndicatorRef.current.style.transition = '0.25s';
										activityIndicatorRef.current.style.transform = `translate(20px)`;
										activityIndicatorRef.current.style.width = ``;
										setType(0);
									}
								}}
								checked={type === 0}
								type="radio"
								name={'notifyType'}
								value={1}
							/>
							<span>Дата</span>
						</label>

						<label ref={timeRef}>
							<input
								onChange={() => {
									if (swiperRef?.current?.swiper) {
										swiperRef?.current?.swiper?.slideTo(1);
									} else {
										activityIndicatorRef.current.style.transition = '0.25s';
										activityIndicatorRef.current.style.width = `${timeRef.current.offsetWidth}px`;
										let left = getPosition(typeSwiperContRef, timeRef);
										activityIndicatorRef.current.style.transform = `translate(${left}px)`;
										setType(1);
									}
								}}
								checked={type === 1}
								type="radio"
								name={'notifyType'}
								value={2}
							/>
							<span>Время</span>
						</label>

						<label ref={archiveRef}>
							<input
								onChange={() => {
									if (swiperRef?.current?.swiper) {
										swiperRef?.current?.swiper?.slideTo(2);
									} else {
										activityIndicatorRef.current.style.transition = '0.25s';
										activityIndicatorRef.current.style.width = `${archiveRef.current.offsetWidth}px`;
										let left = getPosition(typeSwiperContRef, archiveRef);
										activityIndicatorRef.current.style.transform = `translate(${left}px)`;
										setType(2);
									}
								}}
								checked={type === 2}
								type="radio"
								name={'notifyType'}
								value={3}
							/>
							<span>Архив</span>
						</label>

						<span ref={activityIndicatorRef} className={styles.activityTypeIndicator}></span>
					</div>
				</div>
			</div>

			<main ref={mainRef} className={styles.main}>
				{!search && (
					<Swiper
						onSlideChangeTransitionStart={(swiper) => {
							setType(swiper.activeIndex);
						}}
						initialSlide={type}
						className="container"
						onProgress={(swiper) => {
							firstRender.current = true;
							if (firstRender.current) {
								if (swiper.progress === 0) {
									activityIndicatorRef.current.style.transition = '0.25s';
									activityIndicatorRef.current.style.transform = `translate(20px)`;

									activityIndicatorRef.current.style.width = ``;
								}
								if (swiper.progress > 0 && swiper.progress < 0.5) {
									let left = getPosition(typeSwiperContRef, dateRef);
									let width =
										(swiper.progress * timeRef.current.offsetWidth) / 0.5 +
										((0.5 - swiper.progress) * dateRef.current.offsetWidth) / 0.5;
									let pos = (left + 20 * swiper.progress) / 0.5;
									activityIndicatorRef.current.style.width = `${width}px`;
									activityIndicatorRef.current.style.transform = `translate(${20 + pos}px)`;
								}
								if (swiper.progress === 0.5) {
									activityIndicatorRef.current.style.transition = '0.25s';
									activityIndicatorRef.current.style.width = `${timeRef.current.offsetWidth}px`;
									let left = getPosition(typeSwiperContRef, timeRef);
									activityIndicatorRef.current.style.transform = `translate(${left}px)`;
								}
								if (swiper.progress > 0.5 && swiper.progress < 1) {
									let left = getPosition(typeSwiperContRef, archiveRef);
									let width =
										(swiper.progress * archiveRef.current.offsetWidth) / 1 +
										((1 - swiper.progress) * timeRef.current.offsetWidth) / 1;
									let pos = (left * swiper.progress * 0.5) / 1;
									let leftPos = getPosition(typeSwiperContRef, timeRef);
									activityIndicatorRef.current.style.transform = `translate(${leftPos + pos}px)`;
								}
								if (swiper.progress === 1) {
									activityIndicatorRef.current.style.transition = '0.25s';
									activityIndicatorRef.current.style.width = `${archiveRef.current.offsetWidth}px`;
									let left = getPosition(typeSwiperContRef, archiveRef);
									activityIndicatorRef.current.style.transform = `translate(${left}px)`;
								}
							}
						}}
						ref={swiperRef}>
						<SwiperSlide>
							<div className={`container ${styles.noSidePadding}`}>
								<MyDatePicker
									full={calendarFull}
									setFull={setCalendarFull}
									value={date}
									onChange={() => setDate(date)}
								/>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<TimePicker />
						</SwiperSlide>

						<SwiperSlide>
							<MyDatePicker
								full={calendarFull}
								setFull={setCalendarFull}
								value={date}
								onChange={() => setDate(date)}
							/>
						</SwiperSlide>
					</Swiper>
				)}
			</main>

			{!search && (
				<footer className={styles.footer}>
					<div className={styles.container}>
						<div className={styles.toggler}>
							<label>
								<input
									onChange={() => {
										indicatorTextareaRef.current.style.left = '0px';
										indicatorTextareaRef.current.style.right = '0px';
										indicatorTextareaRef.current.style.transform = 'translateX(2px)';
									}}
									type={'radio'}
									defaultChecked
									value={'food'}
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
									}}
									type={'radio'}
									value={'drugs'}
									name={'adminTypeEvent'}
								/>
								<span>Медикаменты</span>
							</label>

							<label>
								<input
									onChange={() => {
										indicatorTextareaRef.current.style.transform = 'translateX(200%)';
										indicatorTextareaRef.current.style.left = '-2px';
										indicatorTextareaRef.current.style.right = '0px';
									}}
									type={'radio'}
									value={'activity'}
									name={'adminTypeEvent'}
								/>
								<span>Активность</span>
							</label>

							<span ref={indicatorTextareaRef} className={styles.indicator}></span>
						</div>
					</div>
				</footer>
			)}

			{search && (
				<div className={styles.searchInput}>
					<button>
						<svg
							width="10"
							height="18"
							viewBox="0 0 10 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M9 17L1 9L9 1"
								stroke="#3192FD"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>

					<label>
						<input ref={searchInputRef} />
					</label>
				</div>
			)}
		</>
	);
};

export default AdminPage;
