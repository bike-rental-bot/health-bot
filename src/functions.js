export const formatTime = (currentDate) => {
	const datetimeString = currentDate;
	const timeArray = datetimeString.split(' ')[1].split(':');
	const hours = timeArray[0];
	const minutes = timeArray[1];

	return `${hours}:${minutes}`;
};
