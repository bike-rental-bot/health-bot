export default {
	API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://impulsrent.ru:8203/api',
};

export const EVENTTYPES = ['nutrition', 'preparations', 'day_regime'];

export const TYPESMAP = {
	food: 'nutrition',
	drugs: 'preparations',
	activity: 'day_regime',
};
