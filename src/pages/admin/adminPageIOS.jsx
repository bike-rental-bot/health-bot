import HeaderAdmin from '../../components/HeaderAdmin';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFormState, setSelectUserValue } from '../../redux/adminSlice';
import Select from '../../components/UI/Select';
import { toggleIndicator1, toggleIndicator2, getPosition, startDateFunction } from './functions.js';
import AdminTextEditor from '../../components/AdminTextEditor';
import { Swiper, SwiperSlide } from 'swiper/react';
import moment from 'moment';
import { post } from '../../lib/api.js';
import config from '../../config.js';
import TimePicker from '../../components/UI/TimePicker/index.jsx';
import MyDatePicker from '../../components/UI/MyDatePicker/index.jsx';
import Toasify from '../../components/UI/Toasify/index.jsx';
import AdminTogglerNotify from '../../components/AdminTogglerNotify/index.jsx';
import AdminSearchForm from '../../components/AdminSearchForm/index.jsx';
import Archieve from '../../components/Archieve/index.jsx';
import { useNavigate } from 'react-router-dom';
import SearchSVG from '../../components/Icons/Search.jsx';
import { get } from '../../lib/api.js';
import "./style.scss"

const ACTIVETEXTFIELDS = {
	title: false,
	description: false,
	link: false,
};

const WebApp = window.Telegram.WebApp;

const AdminPageIOS = () => {
	const navigate = useNavigate();

	const formState = useSelector((state) => state.admin.formState);
	const indicatorRef = useRef();
	const [type, setType] = useState(0);
	const [mainType, setMainType] = useState(0);
	const [activeTextFields, setActiveTextFields] = useState(ACTIVETEXTFIELDS);
	const [focusTextFields, setFocusTextFields] = useState(ACTIVETEXTFIELDS);
	const [formFiles, setFormFiles] = useState([]);
	const [date, setDate] = useState(formState?.time ? startDateFunction(formState?.time) : []);
	const [stateToasify, setStateToasify] = useState({
		status: 'positive',
		text: '',
		isActive: false,
	});
	const [search, setSearch] = useState(false);
	const [postLoading, setPostLoading] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [calendarFull, setCalendarFull] = useState(false);
	const [searchFocus, setSearchFocus] = useState(false);
	const [archieveList, setArchieveList] = useState(null);
	const selectUserValue = useSelector((state) => state.admin.selectUserValue);

	const patients = useSelector((state) => state.admin.patients);
	const token = useSelector((state) => state.user.token);
	const [error, setError] = useState(null);

	const swiperRef = useRef(null);
	const footerRef = useRef(null);
	const typeSwiperContRef = useRef();
	const dateRef = useRef();
	const timeRef = useRef();
	const archiveRef = useRef();
	const activityIndicatorRef = useRef();
	const mainRef = useRef();
	const isTimeChanged = useRef(false);
	const [timeParams, setTimeParams] = useState({ minutes: 0, hours: 0 });
	const firstRender = useRef(false);
	const searchInputContRef = useRef();
	const searchInputRef = useRef();
	const headerRef = useRef();
	const resizeObserverTimeout = useRef();

	const dispatch = useDispatch();

	const isOpenKeyboard = useSelector((state) => state.app.isOpenKeyboard);
	const viewport = useSelector((state) => state.app.viewPort);

	const onClickCreateEvent = async () => {
		if (!postLoading) {
			const formData = new FormData();
			let attachments = [];
			let addFileNum = 0;
			setPostLoading(true);

			for (let i = 0; i < formFiles.length; i++) {
				if (formFiles[i].file) {
					addFileNum = addFileNum + 1;
					formData.append('files', formFiles[i]?.file);
				} else attachments.push(formFiles[i].preview.src);
			}

			if (
				isTimeChanged.current &&
				date.length !== 0 &&
				formState.title.trim() !== '' &&
				formState.description.trim() !== '' &&
				formState.user_id
			) {
				if (addFileNum > 0) {
					const uploadFiles = await fetch(`${config.API_BASE_URL}/notify/upload?token=${token}`, {
						method: 'POST',
						body: formData,
					})
						.then((res) => res.json())
						.then((res) => {
							attachments = res?.files ? [...attachments, ...res.files] : [attachments];
							console.log('image success');
						})
						.catch((err) => {
							setStateToasify({
								...stateToasify,
								active: true,
								text: `Ошибка сервера ${err}`,
								status: 'negative',
							});
							console.log('image error');
						});
				}

				post('/notify/addNotify', {}, { ...formState, attachments, token })
					.then((res) => {
						dispatch(
							setFormState({ ...formState, title: '', attachment_url: '', description: '' }),
						);
						setActiveTextFields({ ...ACTIVETEXTFIELDS });
						setStateToasify({
							...stateToasify,
							active: true,
							text: 'Событие создано',
							status: 'positive',
						});

						setDate([]);
						setPostLoading(false);

						if ('vibrate' in navigator) {
							navigator.vibrate([200]);
						}

						if (type !== 1) {
							isTimeChanged.current = false;
						}
					})
					.catch((err) => {
						setStateToasify({
							...stateToasify,
							active: true,
							text: `Ошибка сервера ${err}`,
							status: 'negative',
						});

						setPostLoading(false);
					});
			} else {
				setPostLoading(false);
				if (!formState.user_id) {
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
					setActiveTextFields({
						...activeTextFields,
						title: true,
						description: false,
						link: false,
					});
					return;
				}

				if (formState.description === '') {
					setStateToasify({
						...stateToasify,
						active: true,
						text: 'Введите текст',
						status: 'negative',
					});
					setActiveTextFields({
						...activeTextFields,
						description: true,
						title: false,
						link: false,
					});
					return;
				}

				if (date.length === 0) {
					swiperRef?.current?.swiper?.slideTo(0);
					setMainType(0);

					setStateToasify({
						...stateToasify,
						active: true,
						text: 'Выберите дату',
						status: 'negative',
					});
					return;
				}

				if (!isTimeChanged.current) {
					swiperRef?.current?.swiper?.slideTo(1);

					setMainType(1);

					setStateToasify({
						...stateToasify,
						active: true,
						text: 'Выберите время',
						status: 'negative',
					});
				}
			}
		}
	};

	const progressSwiper = (swiper) => {
		firstRender.current = true;
		if (firstRender.current) {
			if (swiper.progress === 0) {
				activityIndicatorRef.current.style.transition = '0.25s';
				activityIndicatorRef.current.style.transform = `translate(20px)`;

				activityIndicatorRef.current.style.width = ``;
			}
			if (swiper.progress > 0 && swiper.progress < 1) {
				let left = getPosition(typeSwiperContRef, dateRef);
				let width =
					(swiper.progress * timeRef.current.offsetWidth) / 0.5 +
					((0.5 - swiper.progress) * dateRef.current.offsetWidth) / 0.5;
				let pos = (left + 20 * swiper.progress) / 0.5;
				activityIndicatorRef.current.style.width = `${width}px`;
				activityIndicatorRef.current.style.transform = `translate(${20 + pos}px)`;
			}
			if (swiper.progress === 1) {
				activityIndicatorRef.current.style.transition = '0.25s';
				activityIndicatorRef.current.style.width = `${timeRef.current.offsetWidth}px`;
				let left = getPosition(typeSwiperContRef, timeRef);
				activityIndicatorRef.current.style.transform = `translate(${left}px)`;
			}
		}
	};

	useEffect(() => {
		if (type === 0) {
			activityIndicatorRef.current.style.transition = '0s';
			activityIndicatorRef.current.style.transform = `translate(20px)`;
			activityIndicatorRef.current.style.width = ``;
			setMainType(0);
		}
	}, [type]);

	const copyClick = (res) => {
		setActiveTextFields({ title: true, description: true, link: true });

		let images = [...formFiles];

		if (Array.isArray(res.attachments)) {
			for (let i = 0; i < 3 - formFiles.length && i < res.attachments.length; i++) {
				images.push({
					preview: {
						src: res.attachments[i],
						key: res.attachments[i],
					},
				});
			}
			setFormFiles(images);
		}

		dispatch(
			setFormState({
				...formState,
				title: res?.title,
				description: res?.description,
				preview_url: res.preview_url,
				type: res.type,
			}),
		);
		setStateToasify({
			...stateToasify,
			active: true,
			text: 'Событие скопировано',
			status: 'positive',
		});
	};

	const onClickPreview = () => {
		if (formState.user_id) {
			navigate('/');
		} else {
			setStateToasify({
				...stateToasify,
				active: true,
				text: 'Выберите пациента для предпросмотра',
				status: 'negative',
			});
		}
	};

	useEffect(() => {
		const root = document.getElementById('root');
		if (type === 0) {
			setSearch(false);
			indicatorRef.current.style.transform = 'translateX(0)';
			indicatorRef.current.style.left = '2px';
		}

		if (type === 1) {
			indicatorRef.current.style.transform = 'translateX(100%)';
			indicatorRef.current.style.left = '-2px';
		}
	}, [type]);

	useEffect(() => {
		const root = document.getElementById('root');
		if (indicatorRef.current) {
			indicatorRef.current.style.transition = '0s';
			if (type === 0) {
				indicatorRef.current.style.transform = 'translateX(0)';
				indicatorRef.current.style.left = '2px';
			}

			if (type === 1) {
				indicatorRef.current.style.transform = 'translateX(100%)';
				indicatorRef.current.style.left = '-2px';
			}
		}
	}, [searchFocus]);

	useEffect(() => {
		if (mainType === 1) {
			isTimeChanged.current = true;
		}
	}, [mainType]);

	useEffect(() => {
		WebApp.MainButton.hide();
	}, []);

	useEffect(() => {
		const headerEl = headerRef?.current;
		const secondElement = footerRef?.current;
		const searchElement = searchInputContRef?.current;
		const root = document.getElementById('root');

		const resizeObserver = new ResizeObserver((entries) => {
			clearTimeout(resizeObserverTimeout);

			resizeObserverTimeout.current = setTimeout(() => {
				for (let entry of entries) {
					let activeElement = document.activeElement;
					let dataNameValue = activeElement.getAttribute('data-name');
					if (entry.target === headerEl) {
						if (footerRef?.current) {
							if (
								document?.activeElement?.getBoundingClientRect().bottom >
									footerRef.current?.getBoundingClientRect().top &&
								window.innerHeight > WebApp.viewportHeight &&
								dataNameValue === 'input-create-event'
							) {
								footerRef.current.style.visibility = 'hidden';
								footerRef.current.style.opacity = '0';
							} else {
								footerRef.current.style.visibility = '';
								footerRef.current.style.opacity = '';
							}
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
	}, [search]);

	useEffect(() => {
		const root = document.getElementById('root');

		function scroll() {
			let activeElement = document.activeElement;
			let dataNameValue = activeElement.getAttribute('data-name');

			if (footerRef?.current) {
				if (
					document?.activeElement?.getBoundingClientRect().bottom >
						footerRef.current?.getBoundingClientRect().top &&
					dataNameValue === 'input-create-event'
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
			let activeElement = document.activeElement;
			let dataNameValue = activeElement.getAttribute('data-name');
			if (footerRef?.current) {
				if (
					document?.activeElement?.getBoundingClientRect()?.bottom >
						footerRef?.current?.getBoundingClientRect()?.top &&
					dataNameValue === 'input-create-event'
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
		root.addEventListener('scroll', scroll);

		WebApp.onEvent('viewportChanged', viewportChanged);

		return () => {
			root.removeEventListener('scroll', scroll);
			WebApp.offEvent('viewportChanged', viewportChanged);
		};
	}, []);

	useEffect(() => {
		const datesUTC = [];

		for (let i = 0; i < date.length; i++) {
			let momentDate = moment.utc([
				date[i].getFullYear(),
				date[i].getMonth(),
				date[i].getDate(),
				timeParams.hours,
				timeParams.minutes,
			]);

			momentDate = momentDate?.toISOString()?.slice(0, -5);

			datesUTC.push(momentDate);
		}

		dispatch(setFormState({ ...formState, time: datesUTC }));
	}, [date, timeParams]);

	useEffect(() => {
		const overflow = 1;
		document.body.style.marginTop = `${overflow}px`;
		document.body.style.paddingBottom = `${overflow}px`;
		document.body.style.background = '';
		document.body.style.overflow = 'hidden';
		document.body.style.height = `100vh`;
		window.scrollTo(0, overflow);
		const root = document.getElementById('root');
		root.style.height = `${window.innerHeight}`;
	}, []);

	return (
		<>
			<div ref={headerRef} className={styles.headerIOSCont}>
				{!searchFocus && (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							onClickCreateEvent();
						}}
						enсtype="multipart/form-data">
						<HeaderAdmin onClickPreview={onClickPreview} disabledBtn={postLoading} />

						<div className={`container ${styles.container}`}>
							<div className={`${styles.toggler} ${styles.ios}`}>
								<label>
									<input
										onChange={() => {
											setType(0);
										}}
										checked={type === 0}
										value={0}
										type={'radio'}
										name="time"
									/>
									<span>Создать</span>
								</label>
								<label>
									<input
										onChange={() => {
											setType(1);
										}}
										checked={type === 1}
										value={1}
										type={'radio'}
										name="time"
									/>
									<span>Архив</span>
								</label>

								<span ref={indicatorRef} className={styles.indicator}></span>
							</div>

							<Select
								value={selectUserValue}
								onChange={(value, index) => {
									dispatch(setFormState({ ...formState, user_id: value?.id, token: value?.token }));
									dispatch(setSelectUserValue(index));
								}}
								variants={patients}
								className={styles.iosSelect}
							/>
							{type === 0 && (
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
							)}
						</div>
					</form>
				)}

				{type === 1 && (
					<form
						className={`container ${styles.searchInputIOS} ${searchFocus && styles.focus}`}
						onSubmit={(e) => {
							e.preventDefault();
							if (searchInputRef?.current) {
								searchInputRef.current.blur();
								setSearchValue(searchInputRef?.current?.value);
							}
						}}>
						<label>
							<input
								onBlur={() => {
									const root = document.getElementById('root');
									root.scrollTo(0, 0);
									window.scrollTo(0, 0);
									setSearchFocus(false);
								}}
								ref={searchInputRef}
								onFocus={() => {
									setSearchFocus(true);
								}}
								placeholder="Поиск по архиву"
								enterKeyHint="search"
								type={'search'}
							/>

							<button>
								<SearchSVG />
							</button>
						</label>
					</form>
				)}

				{type === 0 && (
					<div className={`${styles.type}`}>
						<div ref={typeSwiperContRef} className={`container ${styles.container}`}>
							<label ref={dateRef}>
								<input
									onChange={() => {
										if (swiperRef?.current?.swiper) swiperRef.current.swiper.slideTo(0);
										else {
											toggleIndicator1(activityIndicatorRef);
											setMainType(0);
										}
									}}
									onClick={() => {
										setActiveTextFields({ ...ACTIVETEXTFIELDS });
									}}
									checked={mainType === 0}
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
											toggleIndicator2(activityIndicatorRef, timeRef, typeSwiperContRef);
											setMainType(1);
										}
									}}
									onClick={() => {
										setActiveTextFields({ ...ACTIVETEXTFIELDS });
									}}
									checked={mainType === 1}
									type="radio"
									name={'notifyType'}
									value={2}
								/>
								<span>Время</span>
							</label>

							<span ref={activityIndicatorRef} className={styles.activityTypeIndicator}></span>
						</div>
					</div>
				)}
			</div>

			<div style={{ flex: '1 0 auto', position: 'relative', minHeight: 50 }}>
				<main ref={mainRef} className={styles.main}>
					{type === 0 ? (
						<Swiper
							onSlideChangeTransitionStart={(swiper) => {
								setMainType(swiper.activeIndex);
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
										weekDaysContainerClassName={`${styles.weekDays}`}
										className={"admin__date-picker"}
										fullBtnClassName={styles.fullBtnDatePicker}
										multiple={true}
										onChange={(value) => {
											setDate(value);
										}}
									/>
								</div>
							</SwiperSlide>

							<SwiperSlide>
								<div style={{ padding: '40px 0', height: '100%' }}>
									<TimePicker
										onChange={(value) => {
											setTimeParams(value);
										}}
									/>
								</div>
							</SwiperSlide>
						</Swiper>
					) : (
						<Archieve copyClick={copyClick} searchValue={searchValue} />
					)}
				</main>
			</div>

			<Toasify state={stateToasify} status={stateToasify.status} setState={setStateToasify}>
				<span className={styles.toasify}>{stateToasify.text}</span>
			</Toasify>

			{!search && <AdminTogglerNotify className={styles.iosFooter} footerRef={footerRef} />}
		</>
	);
};

export default AdminPageIOS;
