import ApplicationContext from 'ts/context/ApplicationContext';
import { useContext } from 'react';

/**
 * Shows the current URL navigation path. Should not be used in production.
 */
export default function Breadcrumbs(): React.JSX.Element {
	const application = useContext(ApplicationContext);
	if (application === null) { return BreadcrumbsNull(); }

	return (
		<div className="_Breadcrumbs">
			<p>
				{
					application.router.screenStack.map((screenName, index) => {
						return <span key={index} style={{ fontWeight: index === application.router.stackIndex ? 700 : 400 }}> { screenName } </span>;
					})
				}
			</p>
		</div>
	);
}

function BreadcrumbsNull(): React.JSX.Element {
	return (
		<div className="_Breadcrumbs is-null">*application is null*</div>
	);
}