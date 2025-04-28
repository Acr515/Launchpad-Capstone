import Outlet, { IOutletRef } from './components/Outlet';
import { type Settings, defaultSettings } from 'ts/types/Settings';
import { useEffect, useRef, useState } from 'react';
import Application from 'ts/classes/Application';
import type BackgroundType from 'ts/types/BackgroundType';
import Frame from './components/Frame';
import { ModuleConfig } from 'ts/types/ModuleData';
import { type SavedBookmarks } from 'ts/types/SavedBookmarks';
import type ScreenProps from 'ts/types/ScreenProps';
import config from 'config/application-config.json';
import 'config/index.scss';

const application = new Application(config);

/**
 * The app component is the base component rendered by main.tsx. It houses the sole instance of the Application class and manages its state.
 * It also renders the current screen without augmentation; that augmentation is left up to the renderer.
 */
const App = () => {
	// State declarations
	const [screenStack, setScreenStack] = useState<string[]>([]);
	const [screenProps, setScreenProps] = useState<ScreenProps[]>([]);
	const [stackIndex, setStackIndex] = useState(-1);	// -1 indicates initial status where screen is not ready to be shown
	const [previousStackIndex, setPreviousStackIndex] = useState(-1);
	const [activeBackground, setActiveBackground] = useState<BackgroundType>('welcome');
	const [activeModule, setActiveModule] = useState<ModuleConfig | null>(null);
	const [savedBookmarks, setSavedBookmarks] = useState<SavedBookmarks>({});
	const [settings, setSettings] = useState<Settings>(defaultSettings);
	const outletRef = useRef<IOutletRef>(null);

	application.registerAppState({
		screenStack: { value: screenStack, set: setScreenStack },
		screenProps: { value: screenProps, set: setScreenProps },
		stackIndex: { value: stackIndex, set: setStackIndex },
		previousStackIndex: { value: previousStackIndex, set: setPreviousStackIndex },
		activeBackground: { value: activeBackground, set: setActiveBackground },
		activeModule: { value: activeModule, set: setActiveModule },
		savedBookmarks: { value: savedBookmarks, set: setSavedBookmarks },
		settings: { value: settings, set: setSettings },
	});

	// Initialize application
	useEffect(() => {
		application.preloadCoreAssets()
			.then(() => {
				if (outletRef.current === null) { return; }
				setStackIndex(0);
				setScreenStack(['/']);
				setScreenProps([null]);
				setSavedBookmarks(application.getSavedBookmarks());
				setSettings(application.getSettings());
				outletRef.current.prepare();
			});
	}, []);

	return (
		<Frame application={application}>
			<Outlet ref={outletRef} />
		</Frame>
	);
};

export default App;