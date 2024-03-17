import { useCallback, useEffect, useRef, useState } from 'react';
import MyDatePicker from '../../components/UI/MyDatePicker';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import TimeTable from '../../components/UI/TimeTable';
import styles from './styles.module.scss';

const TimeToggle = () => {
	const [calendarDate, setCalendarDate] = useState(
		new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
	);
	const [type, setType] = useState(0);
	const [calendarFull, setCalendarIsFull] = useState(false);
	const [timetableFull, setTimeTableFull] = useState(false);
	const indicatorRef = useRef();
	const swiperRef = useRef();
	const calendarRef = useRef();
	const timetableRef = useRef();

	const resizeFunction = useCallback(
		(height) => {
			if (type === 1) {
				swiperRef.current.style.transition = '0s';
				swiperRef.current.style.height = `${height}px`;
			}
		},
		[type],
	);

	useEffect(() => {
		if (type === 0) {
			if (calendarFull) {
				swiperRef.current.style.transition = '0.5s';
				swiperRef.current.style.height = `432px`;
			} else {
				swiperRef.current.style.transition = '0.5s';
				swiperRef.current.style.height = `273px`;
			}
		}
	}, [calendarFull, type]);


	return (
		<div className={`container ${styles.container}`}>
			<div className="container">
				<div className={styles.toggler}>
					<label>
						<input
							onChange={() => {
								indicatorRef.current.style.transform = 'translateX(0)';
								indicatorRef.current.style.left = '2px';
								setType(0);
								swiperRef.current.swiper.slideTo(0);
							}}
							checked={type === 0}
							value={0}
							type={'radio'}
							name="time"
						/>
						<span>Календарь</span>
					</label>
					<label>
						<input
							onChange={() => {
								indicatorRef.current.style.transform = 'translateX(100%)';
								indicatorRef.current.style.left = '-2px';
								setType(1);
								swiperRef.current.swiper.slideTo(1);
							}}
							checked={type === 1}
							value={1}
							type={'radio'}
							name="time"
						/>
						<span>Время</span>
					</label>

					<span ref={indicatorRef} className={styles.indicator}></span>
				</div>
			</div>

			<Swiper
				ref={swiperRef}
				spaceBetween={50}
				slidesPerView={1}
				style={{ width: '100%', marginTop: 20 }}
				onSlideChangeTransitionStart={(swiper) => {
					if (swiper.activeIndex === 0)
						swiperRef.current.style.height = `${calendarRef?.current.offsetHeight}px`;
					else swiperRef.current.style.height = `${timetableRef?.current.offsetHeight}px`;
				}}
				onSlideChangeTransitionEnd={(swiper) => {
					setType(swiper.activeIndex);
					if (swiper.activeIndex === 1) {
						indicatorRef.current.style.left = '-2px';
					} else {
						indicatorRef.current.style.left = '2px';
					}
				}}
				onProgress={(swiper) => {
					if (swiper.progress >= 0 && swiper.progress <= 1) {
						indicatorRef.current.style.transform = `translateX(${swiper.progress * 100}%)`;
					}
				}}>
				<SwiperSlide>
					<MyDatePicker
						full={calendarFull}
						setFull={setCalendarIsFull}
						calendarRef={calendarRef}
						value={calendarDate}
						onChange={(date) => {
							setCalendarDate(date);
						}}
					/>
				</SwiperSlide>
				<SwiperSlide>
					<TimeTable
						resizeFunction={resizeFunction}
						full={timetableFull}
						setFull={setTimeTableFull}
						timetableRef={timetableRef}
						date={calendarDate}
					/>
				</SwiperSlide>
			</Swiper>
		</div>
	);
};

export default TimeToggle;
