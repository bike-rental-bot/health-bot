import { useRef, useState } from 'react';
import MyDatePicker from '../../components/UI/MyDatePicker';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import TimeTable from '../../components/UI/TimeTable';
import styles from './styles.module.scss';
const MainPage = () => {
	const [calendarDate, setCalendarDate] = useState(new Date());
	const [type, setType] = useState(0);
	const indicatorRef = useRef();
	const swiperRef = useRef();
	return (
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
						name="variant"
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
						name="variant"
					/>
					<span>Время</span>
				</label>

				<span ref={indicatorRef} className={styles.indicator}></span>
			</div>
			<Swiper
				ref={swiperRef}
				spaceBetween={50}
				slidesPerView={1}
				style={{ width: '100%', marginTop: 36 }}
				onSlideChangeTransitionEnd={(swiper) => {
					setType(swiper.activeIndex);
					if (swiper.activeIndex === 1) {
						indicatorRef.current.style.left = '-2px';
					} else {
						indicatorRef.current.style.left = '2px';

						console.log('efvdwfvdsc');
					}
				}}
				onProgress={(swiper) => {
					if (swiper.progress >= 0 && swiper.progress <= 1) {
						indicatorRef.current.style.transform = `translateX(${swiper.progress * 100}%)`;
					}
				}}>
				<SwiperSlide>
					<MyDatePicker
						value={calendarDate}
						onChange={(date) => {
							setCalendarDate(date);
						}}
					/>
				</SwiperSlide>
				<SwiperSlide>
					<TimeTable date={calendarDate} />
				</SwiperSlide>
			</Swiper>
		</div>
	);
};

export default MainPage;
