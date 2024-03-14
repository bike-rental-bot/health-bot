const NotifyToggle = () => {
	const activityIndicatorRef = useRef();

	const foodRef = useRef();
	const drugsRef = useRef();
	const activityRef = useRef();
	const actContRef = useRef();

	return (
		<>
			<div ref={actContRef} className={styles.activityType}>
				<div className={`container ${styles.container}`}>
					<label ref={foodRef}>
						<input
							onChange={() => {
								activityIndicatorRef.current.style.transform = `translate(0)`;
								activityIndicatorRef.current.style.background = `#FF8551`;
								activityIndicatorRef.current.style.width = `${foodRef.current.offsetWidth}px`;
							}}
							defaultChecked
							type="radio"
							name={'notifyType'}
							value={'food'}
						/>
						<span>Питание</span>
					</label>

					<label ref={drugsRef}>
						<input
							onChange={() => {
								activityIndicatorRef.current.style.background = `#00C187`;
								activityIndicatorRef.current.style.width = `${drugsRef.current.offsetWidth}px`;
								const left = getPosition(actContRef, drugsRef) - 20;
								activityIndicatorRef.current.style.transform = `translate(${left}px)`;
							}}
							type="radio"
							name={'notifyType'}
							value={'drugs'}
						/>
						<span>Медикаменты</span>
					</label>

					<label ref={activityRef}>
						<input
							onChange={() => {
								activityIndicatorRef.current.style.background = `#9747FF`;
								activityIndicatorRef.current.style.width = `${activityRef.current.offsetWidth}px`;
								const left = getPosition(actContRef, activityRef) - 20;
								activityIndicatorRef.current.style.transform = `translate(${left}px)`;
							}}
							type="radio"
							name={'notifyType'}
							value={'activity'}
						/>
						<span>Активность</span>
					</label>

					<span ref={activityIndicatorRef} className={styles.activityTypeIndicator}></span>
				</div>
			</div>
		</>
	);
};
