export const getPosition = (parentRef, childRef) => {
	const parentRect = parentRef?.current.getBoundingClientRect();
	const childRect = childRef?.current.getBoundingClientRect();
	return childRect.left - parentRect.left;
};

export const toggleIndicator1 = (iRef) => {
	iRef.current.style.transition = '0.125s';
	iRef.current.style.transform = `translate(20px)`;
	iRef.current.style.width = ``;
};

export const toggleIndicator2 = (iRef, timeRef, typeSwiperContRef) => {
	iRef.current.style.transition = '0.125s';
	iRef.current.style.width = `${timeRef.current.offsetWidth}px`;
	let left = getPosition(typeSwiperContRef, timeRef);
	iRef.current.style.transform = `translate(${left}px)`;
};

export const toggleIndicator3 = (iRef, archiveRef, typeSwiperContRef) => {
	iRef.current.style.transition = '0.125s';
	iRef.current.style.width = `${archiveRef.current.offsetWidth}px`;
	let left = getPosition(typeSwiperContRef, archiveRef);
	iRef.current.style.transform = `translate(${left}px)`;
};

export const startDateFunction = (arr) => {
	let dates = [];
	for (let i = 0; i < arr.length; i++) {
		const date = new Date(arr[i]);
		dates.push(new Date(date?.getFullYear(), date?.getMonth(), date?.getDate(), 0, 0));
	}

	return dates;
};
