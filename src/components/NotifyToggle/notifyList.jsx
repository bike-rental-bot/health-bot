import Notify from '../Notify';
import styles from './style.module.scss';
import { useSelector } from 'react-redux';
const formatTime = (currentDate) => {
	let hours = currentDate.getHours();
	let minutes = currentDate.getMinutes();

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;

	// Создаем строку в формате "ЧЧ:ММ"
	let formattedTime = hours + ':' + minutes;

	return formattedTime;
};

const TYPESMAP = {
	food: 'nutrition',
	drugs: 'preparations',
	activity: 'day_regime',
};
const NotifyList = ({ type, calendarDate }) => {
	const { role } = useSelector((state) => state.user.user);

	const clientEvents = useSelector((state) => state.client);

	const adminEvents = useSelector((state) => state.admin.patientsEvents);

	const patientToken = useSelector((state) => state.admin.formState.token);

	if (role === 'user') {
		return (
			<>
				{Array.isArray(clientEvents[calendarDate.toISOString().slice(0, 10)][type]) &&
					clientEvents[calendarDate.toISOString().slice(0, 10)][type].map((el) => {
						return (
							<Notify
								attachment_url={el.attachment_url}
								title={el.title}
								time={formatTime(new Date(el.time))}
								description={el.description}
								type={type}
							/>
						);
					})}
			</>
		);
	}

	console.log(
		'huy',
		adminEvents[patientToken] && adminEvents[patientToken][calendarDate.toISOString().slice(0, 10)],
	);

	if (role === 'admin') {
		return (
			<>
				{adminEvents[patientToken] &&
					adminEvents[patientToken][calendarDate.toISOString().slice(0, 10)] &&
					adminEvents[patientToken][calendarDate.toISOString().slice(0, 10)][TYPESMAP[type]] &&
					Array.isArray(
						adminEvents[patientToken][calendarDate.toISOString().slice(0, 10)][TYPESMAP[type]],
					) &&
					adminEvents[patientToken][calendarDate.toISOString().slice(0, 10)][TYPESMAP[type]].map(
						(el) => {
							return (
								<Notify
									preview_url={el.notify.preview_url}
									attachments={el.notify.attachments}
									title={el.notify.title}
									time={formatTime(new Date(el.time))}
									description={el.notify.description}
									type={type}
								/>
							);
						},
					)}
			</>
		);
	}

	return <></>;
};

export default NotifyList;
