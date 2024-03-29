import Notify from '../Notify';
import styles from './style.module.scss';
import { useRef, useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import Modal from '../UI/Modal';

import NotifyDescription from '../NotifyDescription';

// Import Swiper styles
import 'swiper/css';

const getPosition = (parentRef, childRef) => {
	const parentRect = parentRef.current.getBoundingClientRect();
	const childRect = childRef.current.getBoundingClientRect();

	return childRect.left - parentRect.left;
};

const getPositionRight = (elementRef, parentRef) => {
	const elementWidth = elementRef.current.offsetWidth;
	const parentWidth = parentRef.current.offsetWidth;

	const rightPosition = parentWidth - elementWidth - elementRef.current.offsetLeft;

	return rightPosition;
};

const NotifyToggle = () => {
	const activityIndicatorRef = useRef();

	const foodRef = useRef();
	const drugsRef = useRef();
	const activityRef = useRef();
	const actContRef = useRef();
	const swiperRef = useRef();

	const [type, setType] = useState(0);

	useEffect(() => {
		activityIndicatorRef.current.style.transform = 'translate(20px)';
		activityIndicatorRef.current.style.width = `63px`;
	}, []);

	useEffect(() => {
		function resizeWin() {
			const swiper = swiperRef.current.swiper;
			console.log(swiperRef.current.swiper.activeIndex);
			let left = 0;

			switch (swiper.activeIndex) {
				case 0:
					activityIndicatorRef.current.style.transition = '0s';
					activityIndicatorRef.current.style.transform = `translate(20px)`;
					activityIndicatorRef.current.style.background = `#FF8551`;
					activityIndicatorRef.current.style.width = `${foodRef.current.offsetWidth}px`;
					return;
				case 1:
					activityIndicatorRef.current.style.transition = '0s';
					activityIndicatorRef.current.style.background = `#00C187`;
					activityIndicatorRef.current.style.width = `${drugsRef.current.offsetWidth}px`;
					left = getPosition(actContRef, drugsRef);
					activityIndicatorRef.current.style.transform = `translate(${left}px)`;

					return;
				case 2:
					activityIndicatorRef.current.style.transition = '0s';
					activityIndicatorRef.current.style.background = `#9747FF`;
					activityIndicatorRef.current.style.width = `${activityRef.current.offsetWidth}px`;
					left = getPosition(actContRef, activityRef);
					activityIndicatorRef.current.style.transform = `translate(${left}px)`;
					return;
			}
		}

		window.addEventListener('resize', resizeWin);

		return () => window.removeEventListener('resize', resizeWin);
	}, []);

	return (
		<>
			<div className={`${styles.activityType} ${styles.sticky}`}>
				<div ref={actContRef} className={`container ${styles.container}`}>
					<label ref={foodRef}>
						<input
							onChange={() => {
								swiperRef.current.swiper.slideTo(0);
							}}
							checked={type === 0}
							type="radio"
							name={'notifyType'}
							value={'food'}
						/>
						<span>Питание</span>
					</label>

					<label ref={drugsRef}>
						<input
							onChange={() => {
								swiperRef.current.swiper.slideTo(1);
							}}
							checked={type === 1}
							type="radio"
							name={'notifyType'}
							value={'drugs'}
						/>
						<span>Медикаменты</span>
					</label>

					<label ref={activityRef}>
						<input
							onChange={() => {
								swiperRef.current.swiper.slideTo(2);
							}}
							checked={type === 2}
							type="radio"
							name={'notifyType'}
							value={'activity'}
						/>
						<span>Активность</span>
					</label>

					<span ref={activityIndicatorRef} className={styles.activityTypeIndicator}></span>
				</div>
			</div>

			<div className={styles.swiperCont}>
				<Swiper
					ref={swiperRef}
					className="container"
					onSlideChangeTransitionStart={(swiper) => {
						let left = 0;
						setType(swiper.activeIndex);
						switch (swiper.activeIndex) {
							case 0:
								activityIndicatorRef.current.style.transition = '0.25s';
								activityIndicatorRef.current.style.transform = `translate(20px)`;
								activityIndicatorRef.current.style.background = `#FF8551`;
								activityIndicatorRef.current.style.width = `${foodRef.current.offsetWidth}px`;
								return;
							case 1:
								activityIndicatorRef.current.style.transition = '0.25s';
								activityIndicatorRef.current.style.background = `#00C187`;
								activityIndicatorRef.current.style.width = `${drugsRef.current.offsetWidth}px`;
								left = getPosition(actContRef, drugsRef);
								activityIndicatorRef.current.style.transform = `translate(${left}px)`;

								return;
							case 2:
								activityIndicatorRef.current.style.transition = '0.25s';
								activityIndicatorRef.current.style.background = `#9747FF`;
								activityIndicatorRef.current.style.width = `${activityRef.current.offsetWidth}px`;
								left = getPosition(actContRef, activityRef);
								activityIndicatorRef.current.style.transform = `translate(${left}px)`;
								return;
						}
					}}
					spaceBetween={50}
					slidesPerView={1}
					style={{ flexDirection: 'row' }}>
					<SwiperSlide className={`container ${styles.notifyList}`}>
						<Notify type={'food'} />
						<Notify type={'food'} />
						<Notify type={'food'} />
						<Notify type={'food'} />
					</SwiperSlide>

					<SwiperSlide className={`container ${styles.notifyList}`}>
						<Notify type={'drugs'} />
						<Notify type={'drugs'} />
						<Notify type={'drugs'} />
						<Notify type={'drugs'} />
					</SwiperSlide>

					<SwiperSlide className={`container ${styles.notifyList}`}>
						<Notify type={'activity'} />
						<Notify type={'activity'} />
						<Notify type={'activity'} />
						<Notify type={'activity'} />
					</SwiperSlide>
				</Swiper>
			</div>
		</>
	);
};

export default NotifyToggle;
