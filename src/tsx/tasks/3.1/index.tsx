import { useContext, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import FinalStep from 'tsx/components/FinalStep';
import GenericStep from 'tsx/components/GenericStep';
import InlineSource from 'tsx/components/InlineSource';
import MultiStepList from 'tsx/components/MultiStepList';
import type StepComponent from 'ts/types/StepComponent';
import type TaskInterfaceOptions from 'ts/types/TaskInterfaceOptions';
import assets from './assets';
import getTask from 'ts/util/getTask';
import useMultiStepRefMatrix from 'ts/hooks/useMultiStepRefMatrix';

export default function CreateYourVSCodeProject(_: TaskInterfaceOptions): StepComponent[] {
	const multiStepRefMatrix = useMultiStepRefMatrix([9, 2]);
	const application = useContext(ApplicationContext);
	const next = application !== null ? getTask('ada75f80', application.config) : null;
	const getRefArray = (index: number) => {
		return multiStepRefMatrix.current !== null ? multiStepRefMatrix.current[index] : undefined;
	};
	const stepsRef = useRef<StepComponent[] | null>(null);

	if (stepsRef.current === null) {
		stepsRef.current = [
			{
				id: '1f93f74b',
				subheading: 'Create your Project',
				element: (
					<GenericStep
						image={assets.StepImage_01a}
						imageHighlights={[{ x1: 0.05, y1: 0.05, x2: 0.95, y2: 0.95 }]}
						imageMaxWidth={10}
					>
						<p>To begin, open VS Code from your desktop if it isn't open already.</p>
					</GenericStep>
				),
			},
			{
				id: '5ea5064d',
				element: (
					<GenericStep
						image={assets.StepImage_02a}
						imageHighlights={[{ x1: 0.21, y1: 0.115, x2: 0.5, y2: 0.178 }]}
					>
						<p>Once VS Code opens, press <strong>Ctrl + Shift + P</strong>, which will open the Command Palette.</p>
						<p>In the prompt that appears at the top of the screen, type <strong>WPILib</strong>. All WPILib commands start with this keyword, so you can find anything you need from this list. Keep typing or scroll down the list and select <strong>WPILib: Create a new project</strong>.</p>
					</GenericStep>
				),
			},
			{
				id: 'a05e59fc',
				element: (
					<GenericStep
						multiStepRefs={getRefArray(0)}
						multiStepMarkerPositions={[
							{ x: 0.075, y: 0.27 },
							{ x: 0.152, y: 0.27 },
							{ x: 0.235, y: 0.27 },
							{ x: 0.439, y: 0.435 },
							{ x: 0.378, y: 0.565 },
							{ x: 0.267, y: 0.62 },
							{ x: 0.16, y: 0.75 },
							{ x: 0.3, y: 0.795 },
							{ x: 0.215, y: 0.89 },
						]}
						image={assets.StepImage_03a}
					>
						<p>The WPILib Project Creator window should open. Make the following selections; the command palette area will show you your options:</p>
						<MultiStepList multiStepRefs={getRefArray(0)}>
							<p>Under Select a project type, choose <strong>Template</strong>.</p>
							<p>Under Select a language, choose <strong>Java</strong>.</p>
							<p>Under Select a base, choose <strong>Timed Robot</strong>.</p>
							<p>Under Base Folder, select any folder on your laptop where the project will be stored. <strong>Do not</strong> pick a folder inside your laptop's OneDrive.</p>
							<p>Under Project Name, write a name for your project. A good name might be <strong>RobotCode{new Date().getFullYear()}</strong>, but you can write anything.</p>
							<p>Ensure <strong>Create a new folder?</strong> is checked.</p>
							<p>Under Team Number, write your team number.</p>
							<p><strong>Do not</strong> check Enable Desktop Support.</p>
							<p>Once everything is entered, click Generate Project.</p>
						</MultiStepList>
					</GenericStep>
				),
			},
			{
				id: '1ccf3b44',
				element: (
					<GenericStep
						image={assets.StepImage_04a}
						imageHighlights={[{ x1: 0.052, y1: 0.68, x2: 0.46, y2: 0.98 }]}
					>
						<p>WPILib has now created your project. A window should open asking you to open it. Go ahead and click <strong>Yes (Current Window)</strong>.</p>
					</GenericStep>
				),
			},
			{
				id: 'a10b358f',
				subheading: 'Open your Project',
				element: (
					<GenericStep
						multiStepRefs={getRefArray(1)}
						multiStepMarkerPositions={[
							{ x: 0.343, y: 0.55 },
							{ x: 0.315, y: 0.668 },
						]}
						image={assets.StepImage_05a}
					>
						<p>Once your project opens, this dialog may appear in VS Code.</p>
						<MultiStepList multiStepRefs={getRefArray(1)}>
							<p>Check the checkbox next to <strong>Trust the authors of all files in the parent folder</strong>.</p>
							<p>Click the blue <strong>Yes, I trust the authors</strong> button to dismiss the dialog.</p>
						</MultiStepList>
					</GenericStep>
				),
			},
			{
				id: '6fa83867',
				element: (
					<GenericStep
						image={assets.StepImage_06a}
						imageHighlights={[{ x1: 0.28, y1: 0.736, x2: 0.48, y2: 0.814 }]}
					>
						<p>Once dismissed, a window at the bottom may appear to start running processes. This is the <strong>terminal</strong> window, and it's building your template program for the first time. You can ignore it, but don't close VS Code until <InlineSource><strong>BUILD SUCCESSFUL</strong></InlineSource> appears.</p>
					</GenericStep>
				),
			},
			{
				id: '9e212eee',
				element: (
					<GenericStep
						image={assets.StepImage_06a}
						imageHighlights={[{ x1: 0.007, y1: -0.007, x2: 0.09, y2: 0.053 }]}
					>
						<p>Normally, your project should open automatically. If not: VS Code opens projects by <strong>directory</strong>, meaning that you open an entire folder with VS Code to access your code instead of opening a single file.</p>
						<p>To open your project, click <strong>File</strong> at the top of the window and click <strong>Open Folder...</strong>, then browse to the file location of your code.</p>
					</GenericStep>
				),
			},
			{
				id: 'ff3ad361',
				hideStepNumber: true,
				element: (
					<FinalStep
						next={next}
					>
						<p>You created your project! Now that you've laid the foundation for your code, it's time to begin filling it with code.</p>
					</FinalStep>
				),
			},
		];
	}

	return stepsRef.current;
}