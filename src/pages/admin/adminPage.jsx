import { Swiper, SwiperSlide } from 'swiper/react';
import AdminTextEditor from '../../components/AdminTextEditor';
import HeaderAdmin from '../../components/HeaderAdmin';
import MyDatePicker from '../../components/UI/MyDatePicker';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import TimePicker from '../../components/UI/TimePicker';
import useDebounce from '../../hooks/useDebounce';
import ArrowLeft from '../../components/Icons/ArrowLeft';
import SearchSVG from '../../components/Icons/Search';
import Archieve from '../../components/Archieve';
import { useSelector } from 'react-redux';
import { EVENTTYPES } from '../../config';
import moment from 'moment';
import { post } from '../../lib/api.js';

const tg = window?.Telegram?.WebApp;

const getPosition = (parentRef, childRef) => {
	const parentRect = parentRef?.current.getBoundingClientRect();
	const childRect = childRef?.current.getBoundingClientRect();

	return childRect.left - parentRect.left;
};

const FORMSTATE = {
	token: null,
	type: 'nutrition',
	title: '',
	description: '',
	attachment_url: '',
	time: null,
	end_date: null,
};

const ACTIVETEXTFIELDS = {
	title: false,
	description: false,
	link: false,
};

const AdminPage = () => {
	const [date, setDate] = useState(new Date());
	const [calendarFull, setCalendarFull] = useState(false);
	const [type, setType] = useState(0);
	const [search, setSearch] = useState(false);
	const [activeTextFields, setActiveTextFields] = useState(ACTIVETEXTFIELDS);
	const indicatorTextareaRef = useRef(null);
	const swiperRef = useRef();
	const typeSwiperContRef = useRef();
	const dateRef = useRef();
	const timeRef = useRef();
	const archiveRef = useRef();
	const activityIndicatorRef = useRef();
	const firstRender = useRef(false);
	const mainRef = useRef(null);
	const searchInputRef = useRef();
	const footerRef = useRef();
	const headerRef = useRef();
	const resizeObserverTimeout = useRef();

	const token = useSelector((state) => state.user.token);

	const [formState, setFormState] = useState({
		...FORMSTATE,
		token: token,
		time: date.toISOString().substring(0, 10),
	});

	const focusTextarea = useSelector((state) => state.admin.focusTextField);

	const clickSearch = () => {
		setSearch(!search);
		swiperRef?.current.swiper.slideTo(2);
	};

	const progressSwiper = (swiper) => {
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
	};

	const toggleIndicator1 = () => {
		activityIndicatorRef.current.style.transition = '0.25s';
		activityIndicatorRef.current.style.transform = `translate(20px)`;
		activityIndicatorRef.current.style.width = ``;
	};

	const toggleIndicator2 = () => {
		activityIndicatorRef.current.style.transition = '0.25s';
		activityIndicatorRef.current.style.width = `${timeRef.current.offsetWidth}px`;
		let left = getPosition(typeSwiperContRef, timeRef);
		activityIndicatorRef.current.style.transform = `translate(${left}px)`;
	};

	const toggleIndicator3 = () => {
		activityIndicatorRef.current.style.transition = '0.25s';
		activityIndicatorRef.current.style.width = `${archiveRef.current.offsetWidth}px`;
		let left = getPosition(typeSwiperContRef, archiveRef);
		activityIndicatorRef.current.style.transform = `translate(${left}px)`;
	};

	useEffect(() => {
		const func = () => {
			if (footerRef.current && headerRef.current && mainRef.current) {
				const block1Bottom = headerRef?.current.getBoundingClientRect().bottom;
				const block2Top = footerRef?.current.getBoundingClientRect().top;
				const distance = block2Top - block1Bottom;

				mainRef.current.style.height = `${distance}px`;
			}
		};

		func();

		window.addEventListener('resize', func);

		return () => {
			window.removeEventListener('resize', func);
		};
	}, []);

	useEffect(() => {
		const firstElement = headerRef?.current;
		const secondElement = footerRef?.current;
		const searchElement = searchInputRef?.current;
		const root = document.getElementById('root');

		const resizeObserver = new ResizeObserver((entries) => {
			clearTimeout(resizeObserverTimeout);

			resizeObserverTimeout.current = setTimeout(() => {
				for (let entry of entries) {
					if (entry.target === firstElement) {
						const { bottom } = entry.contentRect;
						let topPosition = 0;
						if (secondElement?.getBoundingClientRect()?.top) {
							topPosition = secondElement?.getBoundingClientRect()?.top;
						}
						if (searchElement?.getBoundingClientRect().top) {
							topPosition = searchElement?.getBoundingClientRect()?.top;
						}

						const distance = topPosition - bottom;
						const pageHeight = document.documentElement.scrollHeight;
						const bottomCoordinate = pageHeight - mainRef?.current?.getBoundingClientRect().bottom;

						if (mainRef.current) {
							mainRef.current.style.height = `${distance > 50 ? distance : 2}px`;
						}

						if (distance <= 50) {
							root.style.paddingBottom = !search ? '80px' : '72px';
							requestAnimationFrame(() => {
								window.scrollTo({
									top: document.body.scrollHeight,
								});
							});
						} else {
							root.style.paddingBottom = '';
						}
					}
				}
			}, 0);
		});

		if (firstElement) {
			resizeObserver.observe(firstElement);
		}

		if (secondElement) {
			resizeObserver.observe(secondElement);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, [search]);

	useEffect(() => {
		function resizeWin() {
			if (type === 0) {
				toggleIndicator1();
			}
			if (type === 1) {
				toggleIndicator2();
			}
			if (type === 2) {
				toggleIndicator3();
			}
		}
	}, []);

	useEffect(() => {
		function onBackKeyDown() {
			if (search) {
				setSearch(false);
			}
		}
		window.addEventListener('backbutton', onBackKeyDown, false);

		return () => window.removeEventListener('backbutton', onBackKeyDown, false);
	}, []);

	useEffect(() => {
		setFormState({ ...formState, token: token });
	}, [token]);

	const onClickCreateEvent = () => {
		post('/notify/addNotify', {}, formState)
			.then((res) => {
				console.log(res);
				setFormState({ ...formState, title: '', link: '', description: '' });
				setActiveTextFields({ ...ACTIVETEXTFIELDS });
			})
			.catch((err) => console.error(err));
	};

	console.log('form', formState);

	return (
		<>
			<div ref={headerRef} className={styles.header}>
				<HeaderAdmin onClickCreateEvent={onClickCreateEvent} onClickSearch={clickSearch} />

				<div className="container">
					<AdminTextEditor
						activeTextFields={activeTextFields}
						setActiveTextFields={setActiveTextFields}
						textForm={formState}
						setTextForm={setFormState}
					/>
				</div>

				<div className={`${styles.type}`}>
					<div ref={typeSwiperContRef} className={`container ${styles.container}`}>
						<label ref={dateRef}>
							<input
								onChange={() => {
									if (swiperRef?.current?.swiper) swiperRef.current.swiper.slideTo(0);
									else {
										toggleIndicator1();
										setType(0);
									}
								}}
								onClick={() => {
									setActiveTextFields({ ...ACTIVETEXTFIELDS });
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
										toggleIndicator2();
										setType(1);
									}
								}}
								onClick={() => {
									setActiveTextFields({ ...ACTIVETEXTFIELDS });
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
										toggleIndicator3();
										setType(2);
									}
								}}
								onClick={() => {
									setActiveTextFields({ ...ACTIVETEXTFIELDS });
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
				<Swiper
					onSlideChangeTransitionStart={(swiper) => {
						setType(swiper.activeIndex);
					}}
					initialSlide={type}
					style={{ height: '100%' }}
					className="container"
					onProgress={progressSwiper}
					ref={swiperRef}>
					<SwiperSlide style={{ overflow: 'auto' }}>
						<div className={`container ${styles.noSidePadding}`}>
							<MyDatePicker
								full={calendarFull}
								setFull={setCalendarFull}
								value={date}
								onChange={(value) => {
									let momentDate = moment.utc([
										value.getFullYear(),
										value.getMonth(),
										value.getDate(),
										value.getHours(),
										value.getMinutes(),
									]);

									setDate(value);
									setFormState({ ...formState, time: value.toISOString().slice(0, -5) });
								}}
								// min={new Date()}
							/>
						</div>
					</SwiperSlide>

					<SwiperSlide>
						<div style={{ padding: '40px 0', height: '100%' }}>
							<TimePicker
								onChange={(value) => {
									let momentDate = moment.utc([
										date.getFullYear(),
										date.getMonth(),
										date.getDate(),
										value.hours,
										value.minutes,
									]);

									let isoStringWithoutTimeZone = momentDate.toISOString().slice(0, -5);

									setDate(momentDate.toDate());

									setFormState({ ...formState, time: isoStringWithoutTimeZone });
								}}
							/>
						</div>
					</SwiperSlide>

					<SwiperSlide style={{ overflow: 'auto' }}>
						<Archieve />
					</SwiperSlide>
				</Swiper>
			</main>

			{!search && (
				<footer ref={footerRef} className={styles.footer}>
					<div className={styles.container}>
						<div className={styles.toggler}>
							<label>
								<input
									onChange={() => {
										indicatorTextareaRef.current.style.left = '0px';
										indicatorTextareaRef.current.style.right = '0px';
										indicatorTextareaRef.current.style.transform = 'translateX(2px)';

										setFormState({ ...formState, type: EVENTTYPES[0] });
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

										setFormState({ ...formState, type: EVENTTYPES[1] });
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

										setFormState({ ...formState, type: EVENTTYPES[2] });
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
				</footer>
			)}

			{search && (
				<form
					onSubmit={(e) => e.preventDefault()}
					ref={searchInputRef}
					className={styles.searchInput}>
					<div className={`container  ${styles.container}`}>
						<button
							type="button"
							onClick={() => {
								setSearch(false);
							}}>
							<ArrowLeft />
						</button>

						<label>
							<input />
							<button type="submit">
								<SearchSVG stroke="#7F7F84" width={16} height={16} />
							</button>
						</label>
					</div>
				</form>
			)}
		</>
	);
};

export default AdminPage;
