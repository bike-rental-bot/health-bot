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
import config from '../../config.js';

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

	const userInfo = useSelector((state) => state.user);

	const [date, setDate] = useState([]);
	const [calendarFull, setCalendarFull] = useState(false);
	const [type, setType] = useState(0);
	const [search, setSearch] = useState(false);
	const [formFiles, setFormFiles] = useState([]);
	const [searchFocus, setSearchFocus] = useState(false);
	const [focusTextFields, setFocusTextFields] = useState(ACTIVETEXTFIELDS);
	const [activeTextFields, setActiveTextFields] = useState(ACTIVETEXTFIELDS);
	const [stateToasify, setStateToasify] = useState({
		status: 'positive',
		text: '',
		isActive: false,
	});
	const [user, setUser] = useState(null);
	const { viewPort, isOpenKeyboard } = useSelector((state) => state.app);

	const swiperRef = useRef();
	const typeSwiperContRef = useRef();
	const dateRef = useRef();
	const timeRef = useRef();
	const archiveRef = useRef();
	const activityIndicatorRef = useRef();
	const firstRender = useRef(false);
	const mainRef = useRef(null);
	const searchInputContRef = useRef();
	const searchInputRef = useRef();
	const footerRef = useRef();
	const headerRef = useRef();
	const resizeObserverTimeout = useRef();
	const isTimeChanged = useRef(false);
	const timeParams = useRef({ minute: 0, hour: 0 });

	const token = useSelector((state) => state.user.token);

	const formState = useSelector((state) => state.admin.formState);

	const patients = useSelector((state) => state.admin.patients);

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
			if (headerRef.current && mainRef.current) {
				const block1Bottom = headerRef?.current.getBoundingClientRect().height;
				const block2Top = WebApp.viewportHeight - 72;
				const distance = block2Top - block1Bottom;

				mainRef.current.style.height = `${distance}px`;
			}
		};

		const funcV = (e) => {
			if (headerRef.current && mainRef.current) {
				const block1Bottom = headerRef?.current.getBoundingClientRect().height;
				const block2Top = WebApp.viewportHeight - 72;
				const distance = block2Top - block1Bottom;

				mainRef.current.style.height = `${
					distance < 0 ? mainRef.current.offsetHeight : distance
				}px`;
			}
		};

		func();

		window.addEventListener('orientationchange', func);
		WebApp.onEvent('viewportChanged', funcV);

		return () => {
			window.removeEventListener('resize', func);
			WebApp.offEvent('viewportChanged', funcV);
		};
	}, []);

	// изменение размеров блока
	useEffect(() => {
		const headerEl = headerRef?.current;
		const secondElement = footerRef?.current;
		const searchElement = searchInputContRef?.current;
		const root = document.getElementById('root');

		const resizeObserver = new ResizeObserver((entries) => {
			clearTimeout(resizeObserverTimeout);

			resizeObserverTimeout.current = setTimeout(() => {
				for (let entry of entries) {
					if (entry.target === headerEl) {
						if (
							document?.activeElement?.getBoundingClientRect().bottom >
								footerRef.current?.getBoundingClientRect().top &&
							window.innerHeight > WebApp.viewportHeight
						) {
							if (footerRef && footerRef.current) {
								footerRef.current.style.visibility = 'hidden';
								footerRef.current.style.opacity = '0';
							}
						} else {
							if (footerRef && footerRef.current) {
								footerRef.current.style.visibility = '';
								footerRef.current.style.opacity = '';
							}
						}
					}

					if (mainRef.current) {
						const distance =
							WebApp.viewportHeight - headerEl.getBoundingClientRect().bottom - 72 - root.scrollTop;

						if (distance > 50) {
							mainRef.current.style.height = `${distance}px`;
						} else {
							mainRef.current.style.height = `${0}px`;
						}
					}
				}
			}, 0);
		});

		if (headerEl) {
			resizeObserver.observe(headerEl);
		}

		if (secondElement) {
			resizeObserver.observe(secondElement);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, [search, isOpenKeyboard]);

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
		if (type !== 2) {
			setSearch(false);
		}
	}, [type]);

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

	const onClickCreateEvent = async () => {
		const formData = new FormData();

		for (let i = 0; i < formFiles.length; i++) {
			formData.append('files', formFiles[i]?.file);
		}

		if (
			isTimeChanged.current &&
			date.length !== 0 &&
			formState.title.trim() !== '' &&
			formState.description.trim() !== ''
		) {
			let attachments = [];
			if (formFiles.length > 0) {
				const uploadFiles = await fetch(`${config.API_BASE_URL}/notify/upload?token=${token}`, {
					method: 'POST',
					body: formData,
				})
					.then((res) => res.json())
					.then((res) => {
						attachments = res?.files ? res.files : [];
					});
			}
			post('/notify/addNotify', {}, { ...formState, attachments })
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

					console.log('add result', res);
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
			if (!formState.token) {
				setStateToasify({
					...stateToasify,
					active: true,
					text: 'Выберите пользователя',
					status: 'negative',
				});
				return;
			}

			if (formState.title === '') {
				setStateToasify({
					...stateToasify,
					active: true,
					text: 'Введите заголовок',
					status: 'negative',
				});
				setActiveTextFields({ ...activeTextFields, title: true, description: false, link: false });
				return;
			}

			if (formState.description === '') {
				setStateToasify({
					...stateToasify,
					active: true,
					text: 'Введите текст',
					status: 'negative',
				});
				setActiveTextFields({ ...activeTextFields, description: true, title: false, link: false });
				return;
			}

			if (date.length === 0) {
				swiperRef.current.swiper.slideTo(0);
				setType(0);

				setStateToasify({
					...stateToasify,
					active: true,
					text: 'Выберите дату',
					status: 'negative',
				});
				return;
			}

			if (!isTimeChanged.current) {
				swiperRef.current.swiper.slideTo(1);
				setType(1);

				setStateToasify({
					...stateToasify,
					active: true,
					text: 'Выберите время',
					status: 'negative',
				});
			}
		}
	};

	useEffect(() => {
		const root = document.getElementById('root');
		window.addEventListener('orientationchange', () => {
			root.scrollTo({ top: 0 });
		});
	}, []);

	useEffect(() => {
		const overflow = 1;
		document.body.style.marginTop = `${overflow}px`;
		document.body.style.paddingBottom = `${overflow}px`;
		window.scrollTo(0, overflow);
		const root = document.getElementById('root');
		root.style.paddingBottom = '72px';
	}, []);

	useEffect(() => {
		WebApp.MainButton.hide();
	}, []);

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();

					onClickCreateEvent();
				}}
				enctype="multipart/form-data"
				ref={headerRef}
				className={styles.header}>
				{
					<div
						style={{
							overflow: 'hidden',
							height:
								!isOpenKeyboard ||
								!search ||
								focusTextFields.description ||
								focusTextFields.link ||
								focusTextFields.title
									? 'auto'
									: 0,
						}}>
						<HeaderAdmin onClickCreateEvent={onClickCreateEvent} />

						<div className="container">
							<Select
								onChange={(value) => {
									dispatch(setFormState({ ...formState, token: value?.token }));
								}}
								variants={patients}
							/>
							<AdminTextEditor
								activeTextFields={activeTextFields}
								setActiveTextFields={setActiveTextFields}
								focusTextFields={focusTextFields}
								setFocusTextFields={setFocusTextFields}
								textForm={formState}
								setTextForm={setFormState}
								formFiles={formFiles}
								setFormFiles={setFormFiles}
							/>
						</div>
					</div>
				}

				<div
					style={{
						marginTop:
							!isOpenKeyboard ||
							!search ||
							focusTextFields.description ||
							focusTextFields.link ||
							focusTextFields.title
								? undefined
								: 0,
					}}
					className={`${styles.type}`}>
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
			</form>

			<main ref={mainRef} className={styles.main}>
				<Swiper
					onSlideChangeTransitionStart={(swiper) => {
						setType(swiper.activeIndex);

						if (swiper.activeIndex === 2) {
							mainRef.current.style.maxHeight = `${window.innerHeight}px`;
						}
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
								multiple={true}
								onChange={(value) => {
									const datesUTC = [];

									for (let i = 0; i < value.length; i++) {
										let momentDate = moment.utc([
											value[i].getFullYear(),
											value[i].getMonth(),
											value[i].getDate(),
											timeParams.current.hour,
											timeParams.current.minute,
										]);

										momentDate = momentDate.toISOString().slice(0, -5);

										datesUTC.push(momentDate);
									}

									dispatch(setFormState({ ...formState, time: datesUTC }));

									setDate(value);
								}}
							/>
						</div>
					</SwiperSlide>

					<SwiperSlide>
						<div style={{ padding: '40px 0', height: '100%' }}>
							<TimePicker
								onChange={(value) => {
									timeParams.current.hour = value.hours;
									timeParams.current.minute = value.minutes;

									const datesUTC = [];

									for (let i = 0; i < date.length; i++) {
										let momentDate = moment.utc([
											date[i].getFullYear(),
											date[i].getMonth(),
											date[i].getDate(),
											timeParams.current.hour,
											timeParams.current.minute,
										]);

										momentDate = momentDate.toISOString().slice(0, -5);

										datesUTC.push(momentDate);
									}

									dispatch(setFormState({ ...formState, time: datesUTC }));
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
				<AdminSearchForm
					searchInputRef={searchInputRef}
					clickBackBtn={() => setSearch(false)}
					containerRef={searchInputContRef}
					sendSearch={() => {}}
					onFocus={() => setSearchFocus(true)}
					onBlur={() => setSearchFocus(false)}
					togglerRef={typeSwiperContRef}
				/>
			)}

			<Toasify state={stateToasify} status={stateToasify.status} setState={setStateToasify}>
				<span className={styles.toasify}>{stateToasify.text}</span>
			</Toasify>
		</>
	);
};

export default AdminPage;
