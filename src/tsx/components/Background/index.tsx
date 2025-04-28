import { type HTMLAttributes, useContext } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import type BackgroundType from 'ts/types/BackgroundType';
import type { ModuleConfig } from 'ts/types/ModuleData';
import './style.scss';

interface IProps extends HTMLAttributes<HTMLElement> {
	mod: ModuleConfig | null;
	backgroundType: BackgroundType;
}

interface ICSSVariables extends React.CSSProperties {
	'--primary-color': string;
	'--secondary-color': string;
}

export default function Background({ className, backgroundType, mod }: IProps): React.JSX.Element {
	const application = useContext(ApplicationContext);

	const cssVariables: ICSSVariables = {
		'--primary-color': mod?.primaryColor ?? '#fff',
		'--secondary-color': mod?.secondaryColor ?? '#fff',
	};

	if (application === null) { return <></>; }

	const visible = application.activeBackground === backgroundType && application.activeModule === mod;

	return (
		<div className={`_Background ${backgroundType}${!visible ? ' hidden' : ''} ${className ?? ''}`} style={cssVariables}></div>
	);
}