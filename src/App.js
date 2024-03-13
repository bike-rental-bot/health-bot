import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import './App.scss';
import MyDatePicker from './components/UI/MyDatePicker';
import MainPage from './pages/main/mainPage';

function App() {
	return (
		<Routes>
			<Route exact path={''} element={<MainPage />} />
			<Route exact path={'/text'} element={<></>} />
		</Routes>
	);
}

export default App;
