import { get } from './lib/api';
export const formatTime = (currentDate) => {
	const datetimeString = currentDate;
	const timeArray = datetimeString.split(' ')[1].split(':');
	const hours = timeArray[0];
	const minutes = timeArray[1];

	return `${hours}:${minutes}`;
};

export const uniqueArchiveNotify = (res) => {
	let uniqueIds = {};

	// Фильтрация массива объектов
	let uniqueObjectsArray = res?.result?.filter((obj) => {
		// Получаем значение notify.id из текущего объекта

		let id = `${obj.notify.description} ${obj.notify.title} ${obj.notify.preview_url}`;
		// Если id уже был встречен, возвращаем false для фильтрации
		if (uniqueIds[id]) {
			return false;
		}
		// Иначе помечаем id как уже встреченный и возвращаем true
		uniqueIds[id] = true;
		return true;
	});

	return uniqueObjectsArray
};

export const searchByNotify = (token, q, setList) => {
	get('/notify/searchByNotify', {
		token,
		q,
	})
		.then((res) => {
			setList(uniqueArchiveNotify(res));
		})
		.catch(() => {});
};
