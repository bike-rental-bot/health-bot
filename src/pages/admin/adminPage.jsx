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
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { post } from '../../lib/api.js';
import Toasify from '../../components/UI/Toasify/index.jsx';
import Select from '../../components/UI/Select';
import img1 from '../../assets/images/tgUser1.png';
import img2 from '../../assets/images/tgUser2.png';
import img3 from '../../assets/images/tgUser3.png';
import { useNavigate } from 'react-router-dom';
import { setFormState } from '../../redux/adminSlice.js';
import AdminTogglerNotify from './../../components/AdminTogglerNotify/index';
import AdminSearchForm from '../../components/AdminSearchForm/index';

const tg = window?.Telegram?.WebApp;

const getPosition = (parentRef, childRef) => {
	const parentRect = parentRef?.current.getBoundingClientRect();
	const childRect = childRef?.current.getBoundingClientRect();
	return childRect.left - parentRect.left;
};

const ACTIVETEXTFIELDS = {
	title: false,
	description: false,
	link: false,
};

const variants = [
	{ id: 1, img: img1, name: 'Анастасия', nickname: '@nasty' },
	{ id: 2, img: img2, name: 'Леонид', nickname: '@lenya' },
	{ id: 3, img: img3, name: 'Александр', nickname: '@alex' },
	{ id: 1, img: img1, name: 'Анастасия', nickname: '@nasty' },
	{ id: 2, img: img2, name: 'Леонид', nickname: '@lenya' },
	{ id: 3, img: img3, name: 'Александр', nickname: '@alex' },
];

const AdminPage = () => {
	const WebApp = window.Telegram.WebApp;

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [date, setDate] = useState(new Date());
	const [calendarFull, setCalendarFull] = useState(false);
	const [type, setType] = useState(0);
	const [search, setSearch] = useState(false);
	const [activeTextFields, setActiveTextFields] = useState(ACTIVETEXTFIELDS);
	const [stateToasify, setStateToasify] = useState({
		status: 'positive',
		text: '',
		isActive: false,
	});
	const [user, setUser] = useState(null);

	const swiperRef = useRef();
	const typeSwiperContRef = useRef();
	const dateRef = useRef();
	const timeRef = useRef();
	const archiveRef = useRef();
	const activityIndicatorRef = useRef();
	const firstRender = useRef(false);
	const mainRef = useRef(null);
	const searchInputContRef = useRef();
	const footerRef = useRef();
	const headerRef = useRef();
	const resizeObserverTimeout = useRef();
	const isTimeChanged = useRef(false);

	const token = useSelector((state) => state.user.token);

	const formState = useSelector((state) => state.admin.formState);

	useEffect(() => {
		dispatch(setFormState({ ...formState, time: date.toISOString().substring(0, 10) }));
	}, []);

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

	//измерение размеров блока main при изменении размеров окна
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

	// изменение размеров блока
	useEffect(() => {
		const firstElement = headerRef?.current;
		const secondElement = footerRef?.current;
		const searchElement = searchInputContRef?.current;
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

						console.log(bottom, searchElement);

						const distance = topPosition - bottom;
						const pageHeight = document.documentElement.scrollHeight;
						const bottomCoordinate = pageHeight - mainRef?.current?.getBoundingClientRect().bottom;

						if (mainRef.current) {
							mainRef.current.style.height = `${distance > 50 ? distance : 2}px`;
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

	//положение индикатора вкладок при изменении размеров окна
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

	// проверка выбора времени
	useEffect(() => {
		if (type === 1) {
			isTimeChanged.current = true;
		}
	}, [type]);

	// клик mainButton
	useEffect(() => {
		WebApp.MainButton.setText('Предпросмотр').show();
		function clickCloseBtn() {
			const tagName = document.activeElement.tagName.toLowerCase();

			if (tagName === 'textarea' || tagName === 'input') {
				document.activeElement.blur();
			}

			requestAnimationFrame(() => {
				WebApp.showPopup(
					{
						title: 'health_bot',
						message: 'Внесенные изменения могут быть потеряны',
						buttons: [
							{ id: 'close', type: 'destructive', text: 'Закрыть' },
							{ id: 'cancel', type: 'cancel', text: 'Отмена' },
						],
					},
					(id) => {
						if (id === 'close') {
							WebApp.close();
						}
					},
				);
			});
		}

		function clickMainBtn() {
			navigate('/client');
		}
		WebApp.onEvent('backButtonClicked', clickCloseBtn);
		WebApp.onEvent('mainButtonClicked', clickMainBtn);

		return () => {
			WebApp.offEvent('backButtonClicked', clickCloseBtn);
			WebApp.offEvent('mainButtonClicked', clickMainBtn);
		};
	}, []);

	// скрытие/открытие кнопки предпросмотра
	useEffect(() => {
		function viewportChanged(e) {
			if (e.isStateStable) {
				if (window.innerHeight > WebApp.viewportHeight) {
					WebApp.MainButton.hide();
				} else {
					WebApp.MainButton.show();
				}
			} else {
				WebApp.MainButton.show();
			}
		}
		WebApp.onEvent('viewportChanged', viewportChanged);

		return () => {
			WebApp.offEvent('viewportChanged', viewportChanged);
		};
	}, []);

	useEffect(() => {
		const root = document.getElementById('root');
		function scroll() {
			if (footerRef.current) {
				if (
					document?.activeElement?.getBoundingClientRect().bottom >
						footerRef.current?.getBoundingClientRect().top &&
					(document?.activeElement?.tagName.toLowerCase() === 'textarea' ||
						document?.activeElement?.tagName.toLowerCase() === 'input')
				) {
					footerRef.current.style.visibility = 'hidden';
					footerRef.current.style.opacity = '0';
				} else {
					footerRef.current.style.visibility = '';
					footerRef.current.style.opacity = '';
				}
			}
		}
		function viewportChanged() {
			if (footerRef?.current) {
				if (window.innerHeight > WebApp.viewportHeight) {
					if (
						document?.activeElement?.getBoundingClientRect()?.bottom >
							footerRef?.current?.getBoundingClientRect()?.top &&
						(document?.activeElement?.tagName.toLowerCase() === 'textarea' ||
							document?.activeElement?.tagName.toLowerCase() === 'input')
					) {
						footerRef.current.style.visibility = 'hidden';
						footerRef.current.style.opacity = '0';
					} else {
						footerRef.current.style.visibility = '';
						footerRef.current.style.opacity = '';
					}
				} else {
					footerRef.current.style.visibility = '';
					footerRef.current.style.opacity = '';
				}
			}
		}
		root.addEventListener('scroll', scroll);

		WebApp.onEvent('viewportChanged', viewportChanged);

		return () => {
			root.removeEventListener('scroll', scroll);
			WebApp.offEvent('viewportChanged', viewportChanged);
		};
	}, []);

	const onClickCreateEvent = () => {
		if (isTimeChanged.current) {
			post('/notify/addNotify', {}, { ...formState, token })
				.then((res) => {
					dispatch(setFormState({ ...formState, title: '', attachment_url: '', description: '' }));
					setActiveTextFields({ ...ACTIVETEXTFIELDS });
					setStateToasify({
						...stateToasify,
						active: true,
						text: 'Событие создано',
						status: 'positive',
					});

					if (type !== 1) {
						isTimeChanged.current = false;
					}
				})
				.catch((err) => {
					setStateToasify({
						...stateToasify,
						active: true,
						text: 'Ошибка сервера',
						status: 'negative',
					});
				});
		} else {
			swiperRef.current.swiper.slideTo(1);
			setType(1);

			setStateToasify({
				...stateToasify,
				active: true,
				text: 'Выберите время',
				status: 'negative',
			});
		}
	};

	return (
		<>
			<div ref={headerRef} className={styles.header}>
				<HeaderAdmin onClickCreateEvent={onClickCreateEvent} />

				<div className="container">
					<Select onChange={(value) => setUser(value)} variants={variants} />
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
								weekDaysContainerClassName={styles.weekDays}
								fullBtnClassName={styles.fullBtnDatePicker}
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

			{!search && <AdminTogglerNotify clickSearch={clickSearch} footerRef={footerRef} />}

			{search && (
				<AdminSearchForm clickBackBtn={() => setSearch(false)} containerRef={searchInputContRef} />
			)}

			<Toasify state={stateToasify} status={stateToasify.status} setState={setStateToasify}>
				<span className={styles.toasify}>{stateToasify.text}</span>
			</Toasify>
		</>
	);
};

export default AdminPage;
