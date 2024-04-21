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
import { useNavigate } from 'react-router-dom';
import { setFormState, setSelectUserValue } from '../../redux/adminSlice.js';
import AdminTogglerNotify from './../../components/AdminTogglerNotify/index';
import AdminSearchForm from '../../components/AdminSearchForm/index';
import config from '../../config.js';
import {
	toggleIndicator1,
	toggleIndicator2,
	toggleIndicator3,
	startDateFunction,
} from './functions.js';

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

const AdminPage = () => {
	const WebApp = window.Telegram.WebApp;

	const formState = useSelector((state) => state.admin.formState);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userInfo = useSelector((state) => state.user);

	const [date, setDate] = useState(formState?.time ? startDateFunction(formState?.time) : []);
	const selectUserValue = useSelector((state) => state.admin.selectUserValue);
	const [calendarFull, setCalendarFull] = useState(false);
	const [type, setType] = useState(0);
	const [postLoading, setPostLoading] = useState(false);
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
	const [searchValue, setSearchValue] = useState('');

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
	const [timeParams, setTimeParams] = useState({ minutes: 0, hours: 0 });

	const token = useSelector((state) => state.user.token);

	const patients = useSelector((state) => state.admin.patients);

	const focusTextarea = useSelector((state) => state.admin.focusTextField);

	const clickSearch = () => {
		setSearch(!search);
		swiperRef?.current?.swiper?.slideTo(2);
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
	};

	useEffect(() => {
		function resizeWin() {
			if (type === 0) {
				toggleIndicator1(activityIndicatorRef);
			}
			if (type === 1) {
				toggleIndicator2(activityIndicatorRef, timeRef, typeSwiperContRef);
			}
			if (type === 2) {
				toggleIndicator3(activityIndicatorRef, archiveRef, typeSwiperContRef);
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
		function hideFunc() {
			let activeElement = document.activeElement;
			let dataNameValue = activeElement.getAttribute('data-name');
			if (footerRef.current) {
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

			if (searchInputContRef?.current) {
				if (
					document?.activeElement?.getBoundingClientRect().bottom >
						searchInputContRef.current?.getBoundingClientRect().top &&
					dataNameValue === 'input-create-event'
				) {
					searchInputContRef.current.style.visibility = 'hidden';
					searchInputContRef.current.style.opacity = '0';
				} else {
					searchInputContRef.current.style.visibility = '';
					searchInputContRef.current.style.opacity = '';
				}
			}
		}
		function scroll() {
			hideFunc();
		}
		function viewportChanged() {
			hideFunc();
		}
		root.addEventListener('scroll', scroll);

		WebApp.onEvent('viewportChanged', viewportChanged);

		return () => {
			root.removeEventListener('scroll', scroll);
			WebApp.offEvent('viewportChanged', viewportChanged);
		};
	}, []);

	const onClickCreateEvent = async () => {
		if (!postLoading) {
			setPostLoading(true);
			const formData = new FormData();
			let attachments = [];
			let addFileNum = 0;

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
						mode: 'cors',
						body: formData,
					})
						.then((res) => res.json())
						.then((res) => {
							attachments = res?.files ? [...attachments, ...res.files] : [attachments];
							console.log('image success');
						})
						.catch((res) => {
							setStateToasify({
								...stateToasify,
								active: true,
								text: 'Ошибка загрузки файлов',
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

						if (type !== 1) {
							isTimeChanged.current = false;
						}

						if ('vibrate' in navigator) {
							navigator.vibrate([200]);
						}
					})
					.catch((err) => {
						setStateToasify({
							...stateToasify,
							active: true,
							text: 'Ошибка сервера',
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
		}
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
		window.addEventListener('orientationchange', () => {
			root.scrollTo({ top: 0 });
		});
	}, []);

	useEffect(() => {
		if (WebApp.platform === 'android') {
			const overflow = 1;
			document.body.style.marginTop = `${overflow}px`;
			document.body.style.paddingBottom = `${overflow}px`;
			document.body.style.background = '';
			document.body.style.overflow = 'hidden';
			document.body.style.height = `100vh`;
			window.scrollTo(0, overflow);
			const root = document.getElementById('root');
			// root.style.maxHeight = `${window.innerHeight}`;
		}
	}, []);

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

						if (searchInputContRef?.current) {
							if (
								document?.activeElement?.getBoundingClientRect().bottom >
									searchInputContRef.current?.getBoundingClientRect().top &&
								window.innerHeight > WebApp.viewportHeight &&
								dataNameValue === 'input-create-event'
							) {
								searchInputContRef.current.style.visibility = 'hidden';
								searchInputContRef.current.style.opacity = '0';
							} else {
								searchInputContRef.current.style.visibility = '';
								searchInputContRef.current.style.opacity = '';
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

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onClickCreateEvent();
				}}
				enсtype="multipart/form-data"
				ref={headerRef}
				className={styles.header}>
				{
					<div
						style={{
							overflow: 'hidden',
							height:
								!search ||
								!searchFocus ||
								focusTextFields.description ||
								focusTextFields.link ||
								focusTextFields.title
									? 'auto'
									: 0,
						}}>
						<HeaderAdmin disabledBtn={postLoading} onClickPreview={onClickPreview} />

						<div className="container">
							<Select
								value={selectUserValue}
								onChange={(value, index) => {
									dispatch(setFormState({ ...formState, user_id: value?.id, token: value?.token }));
									dispatch(setSelectUserValue(index));
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
							!search ||
							!searchFocus ||
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
										toggleIndicator1(activityIndicatorRef);
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
										toggleIndicator2(activityIndicatorRef, timeRef, typeSwiperContRef);
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
										toggleIndicator3(activityIndicatorRef, archiveRef, typeSwiperContRef);
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

			<div style={{ flex: '1 0 auto', position: 'relative', minHeight: 0 }}>
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
										setTimeParams({ ...value });
									}}
								/>
							</div>
						</SwiperSlide>

						<SwiperSlide style={{ overflow: 'auto' }}>
							<Archieve searchValue={searchValue} copyClick={copyClick} />
						</SwiperSlide>
					</Swiper>
				</main>
			</div>

			{!search && <AdminTogglerNotify clickSearch={clickSearch} footerRef={footerRef} />}

			{search && (
				<AdminSearchForm
					searchInputRef={searchInputRef}
					clickBackBtn={() => setSearch(false)}
					containerRef={searchInputContRef}
					sendSearch={(res) => {
						setSearchValue(res);
					}}
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
