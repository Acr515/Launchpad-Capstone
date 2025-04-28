import ApplicationContext from 'ts/context/ApplicationContext';
import { useContext } from 'react';

export default function ErrorScreen(): React.JSX.Element {
	const application = useContext(ApplicationContext);
	if (application === null) { return ErrorScreenNull(); }
	const goBack = () => {
		application.router.goBack();
	};

	return (
		<div className="_ErrorScreen">
			<p>Outlet render failed: Could not render anything because the screen to render was returned as null.</p>
			<a onClick={goBack}>Click to go back</a>
		</div>
	);
}

function ErrorScreenNull(): React.JSX.Element {
	return (
		<div className="_ErrorScreen is-null">
			<p>Outlet render failed: Could not render anything because the screen to render was returned as null.</p>
			<p>Cannot navigate away because the application instance was also null.</p>
		</div>
	);
}