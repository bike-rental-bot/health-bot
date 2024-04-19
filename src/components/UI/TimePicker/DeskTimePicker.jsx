import styles from './styles.module.scss';
import Modal from '../Modal/index';
import { useState, useRef, useEffect } from 'react';
import DeleteSVG from '../../Icons/Delete';

function addLeadingZero(number) {
	if (number < 10) return String(number).padStart(2, '0');
	return number;
}

const DeskTimePicker = ({ onChange, startHour, startMinute }) => {
	const [minute, setMinute] = useState(addLeadingZero(startMinute));
	const [hour, setHour] = useState(addLeadingZero(startHour));

	const hourInputRef = useRef();
	const minuteInputRef = useRef();

	useEffect(() => {
		let hours;
		let minutes;

		if (!isNaN(hour)) {
			hours = Number(hour);
		} else {
			hours = 0;
		}

		if (!isNaN(minute)) {
			minutes =
				Number(minute) % 5 === 0 ? Number(minute) : Number(minute) + 5 - (Number(minute) % 5);
		} else {
			minutes = 0;
		}

		let obj = { hours, minutes };

		if (typeof onChange === 'function') {
			onChange(obj);
		}
	}, [hour, minute]);
	return (
		<>
			<div className={`${styles.container}`}>
				<div>
					<button
						onClick={() => {
							if (!isNaN(Number(hour))) {
								let bHour = Number(hour) + 1;
								if (bHour < 24) {
									setHour(addLeadingZero(bHour));
								} else {
									setHour(addLeadingZero(0));
									bHour = 0;
								}

								let obj = {
									hours: bHour,
									minutes: minute,
								};
							}
						}}>
						+
					</button>
					<label>
						<input
							ref={hourInputRef}
							onBlur={() => {
								setHour((prev) => addLeadingZero(Number(prev)));
							}}
							onKeyDown={(event) => {
								if (event.keyCode === 13) {
									hourInputRef.current.blur();
								}
							}}
							onChange={(e) => {
								if (!isNaN(Number(e.target.value))) {
									if (Number(e.target.value) < 24) {
										setHour(e.target.value);
									}
								}
							}}
							value={hour}
						/>
					</label>
					<button
						onClick={() => {
							if (!isNaN(Number(hour))) {
								let bHour = Number(hour) - 1;
								if (bHour === -1) {
									setHour(23);
								} else {
									setHour(addLeadingZero(bHour));
								}
							}
						}}>
						-
					</button>
				</div>
				<span>:</span>
				<div>
					<button
						onClick={() => {
							if (!isNaN(Number(minute))) {
								let bMinute = Number(minute) + 5;
								if (bMinute < 60) {
									setMinute(addLeadingZero(bMinute));
								} else {
									setMinute(addLeadingZero(0));
								}
							}
						}}>
						+
					</button>
					<label>
						<input
							ref={minuteInputRef}
							onBlur={(e) => {
								if (!isNaN(minute) && Number(minute) < 56) {
									setMinute(
										Number(minute) % 5 === 0
											? addLeadingZero(Number(minute))
											: addLeadingZero(Number(minute) + 5 - (Number(minute) % 5)),
									);
								} else {
									setMinute(addLeadingZero(0));
								}
							}}
							onKeyDown={(event) => {
								if (event.keyCode === 13) {
									minuteInputRef.current.blur();
								}
							}}
							onChange={(e) => {
								if (!isNaN(Number(e.target.value)) && Number(e.target.value) < 60) {
									setMinute(e.target.value);
								}
							}}
							value={minute}
						/>
					</label>

					<button
						onClick={() => {
							if (!isNaN(Number(minute))) {
								let bMinute = Number(minute) - 5;
								if (bMinute < 0) {
									setMinute(addLeadingZero(55));
								} else {
									setMinute(addLeadingZero(bMinute));
								}
							}
						}}>
						-
					</button>
				</div>
				{/* <div onClick={() => setModalMinutes(true)}>{addLeadingZero(minute)}</div> */}
			</div>

			{/* <Modal activeZindex={100} active={modalMinutes}>
				<div className={styles.modalContainer}>
					<div className={styles.modalSelect}>
						<div className={styles.header}>
							<span>Минуты</span>{' '}
							<button
								onClick={() => {
									setModalMinutes(false);
								}}>
								<DeleteSVG />
							</button>
						</div>

						<ul>
							{MINUTES.map((el) => {
								return (
									<li
										className={el === minute && styles.active}
										onClick={() => {
											setModalMinutes(false);
											setMinute(el);
										}}>
										{el}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</Modal>

			<Modal activeZindex={100} active={modalHours}>
				<div className={styles.modalContainer}>
					<div className={styles.modalSelect}>
						<div className={styles.header}>
							<span>Часы</span>{' '}
							<button
								onClick={() => {
									setModalHours(false);
								}}>
								<DeleteSVG />
							</button>
						</div>

						<ul>
							{HOURS.map((el) => {
								return (
									<li
										className={el === hour && styles.active}
										onClick={() => {
											setModalHours(false);
											setHour(el);
										}}>
										{el}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</Modal> */}
		</>
	);
};

export default DeskTimePicker;
