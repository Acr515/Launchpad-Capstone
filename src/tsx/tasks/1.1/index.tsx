import { useContext, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Button from 'tsx/components/Button';
import FinalStep from 'tsx/components/FinalStep';
import GenericStep from 'tsx/components/GenericStep';
import MultiStepList from 'tsx/components/MultiStepList';
import SecondaryButton from 'tsx/components/SecondaryButton';
import type StepComponent from 'ts/types/StepComponent';
import type TaskInterfaceOptions from 'ts/types/TaskInterfaceOptions';
import assets from './assets';
import getTask from 'ts/util/getTask';
import images from 'assets/images';
import useMultiStepRefMatrix from 'ts/hooks/useMultiStepRefMatrix';

export default function InstallFRCGameToolsTask(options: TaskInterfaceOptions): StepComponent[] {
	const multiStepRefMatrix = useMultiStepRefMatrix([3, 2, 2]);
	const application = useContext(ApplicationContext);
	const { jumpTo, colors } = options;
	const next = application !== null ? getTask('4551816f', application.config) : null;
	const getRefArray = (index: number) => {
		return multiStepRefMatrix.current !== null ? multiStepRefMatrix.current[index] : undefined;
	};
	const stepsRef = useRef<StepComponent[] | null>(null);

	if (stepsRef.current === null) {
		stepsRef.current = [
			{
				id: '66c3082a',
				subheading: 'Uninstall Old Versions',
				element: (
					<GenericStep
						image={assets.StepImage_01a}
						imageHighlights={[{ x1: 0.757, y1: 0.654, x2: 0.971, y2: 0.929 }]}
					>
						<p>Before installing the new season's FRC Game Tools, you should remove any old versions. On your laptop, go to the <strong>Start</strong> menu and type <strong>Add or Remove Programs</strong>. Search for “NI Software” and select Uninstall.</p>
						<p>If you can't find NI Software, you do not need to uninstall anything and can skip to the installation section by clicking the button below.</p>
						<SecondaryButton
							jumpConfig={{ index: 4 }}
							label={'I can\'t find NI Software'}
							action={() => { jumpTo(4); }}
						/>
					</GenericStep>
				),
			},
			{
				id: '945fcd10',
				element: (
					<GenericStep
						image={assets.StepImage_02a}
						imageHighlights={[{ x1: 0.052, y1: 0.783, x2: 0.51, y2: 0.935 }]}
					>
						<p>If a Windows security prompt appears, select <strong>Yes</strong>.</p>
					</GenericStep>
				),
			},
			{
				id: '3d60320c',
				element: (
					<GenericStep
						multiStepRefs={getRefArray(0)}
						multiStepMarkerPositions={[
							{ x: 0.503, y: 0.113 },
							{ x: 0.032, y: 0.297 },
							{ x: 0.17, y: 0.161 },
						]}
						image={assets.StepImage_03a}
					>
						<p>A window for the NI Package Manager should appear.</p>
						<MultiStepList multiStepRefs={getRefArray(0)}>
							<p>Uncheck the <strong>Products Only</strong> checkbox if it isn't already unchecked.</p>
							<p>Select the checkbox to the left of the Name heading.</p>
							<p>Click the red <strong>Remove</strong> button.</p>
						</MultiStepList>
					</GenericStep>
				),
			},
			{
				id: '85a8aa70',
				element: (
					<GenericStep
						image={assets.StepImage_04a}
						imageHighlights={[{ x1: 0.812, y1: 0.873, x2: 0.999, y2: 0.984 }]}
					>
						<p>On the next screen, click <strong>Next</strong>, which will begin the uninstallation. Once complete, <strong>reboot your laptop</strong> before continuing.</p>
					</GenericStep>
				),
			},
			{
				id: 'd29f17ae',
				subheading: 'Installation',
				// TODO: Add component that reads out link's external text
				element: (
					<GenericStep
						image={assets.StepImage_05a}
						imageHighlights={[{ x1: 0.035, y1: 0.713, x2: 0.519, y2: 0.828 }]}
					>
						<p>Download the <strong>FRC Game Tools installer</strong> from the National Instruments website using the link below.</p>
						<p>In order to begin the download, you'll need an NI login; speak to a team leader about accessing existing credentials or creating new ones and log in before continuing.</p>
						<Button
							{...colors}
							label='Get the Installer'
							image={images.icons.link}
							action={() => window.open('https://www.ni.com/en/support/downloads/drivers/download.frc-game-tools.html#500107', '_blank')?.focus() }
							lockMessageInDemo
							style={{ position: 'absolute', zIndex: 1 }}
						/>
					</GenericStep>
				),
			},
			{
				id: '41978b7c',
				element: (
					<GenericStep
						image={assets.StepImage_06a}
						imageHighlights={[{ x1: 0.027, y1: 0.594, x2: 0.373, y2: 0.701 }]}
					>
						<p>Once you've logged in, return to the download page where you'll find a download button. <strong>Click it</strong> to download the installer.</p>
					</GenericStep>
				),
			},
			{
				id: 'c6033b99',
				element: (
					<GenericStep
						image={assets.StepImage_07a}
						imageHighlights={[{ x1: 0.06, y1: 0.766, x2: 0.509, y2: 0.917 }]}
					>
						<p>Navigate to your driver station laptop's Downloads folder. Double-click the downloaded .exe file to run it and start the installation process.</p>
						<p>If a Windows security prompt appears, select <strong>Yes</strong>.</p>
					</GenericStep>
				),
			},
			{
				id: 'e539c02c',
				element: (
					<GenericStep
						multiStepRefs={getRefArray(1)}
						multiStepMarkerPositions={[
							{ x: 0.575, y: 0.83 },
							{ x: 0.787, y: 0.922 },
						]}
						image={assets.StepImage_08a}
					>
						<p>When you reach this screen, do the following:</p>
						<MultiStepList multiStepRefs={getRefArray(1)}>
							<p>Check <strong>I accept the above 2 license agreements</strong>.</p>
							<p>Click <strong>Next</strong>.</p>
						</MultiStepList>
					</GenericStep>
				),
			},
			{
				id: 'cc0c7811',
				element: (
					<GenericStep
						image={assets.StepImage_09a}
						imageHighlights={[{ x1: 0.812, y1: 0.873, x2: 0.999, y2: 0.984 }]}
					>
						<p>A screen prompting you to disable Windows Fast Startup may appear. If it does, leave the <strong>Disable Windows fast startup checkbox</strong> checked, and click <strong>Next</strong>. Fast Startup can cause problems when your laptop tries to connect to the hardware on your robot.</p>
					</GenericStep>
				),
			},
			{
				id: '41c20c6c',
				element: (
					<GenericStep
						image={assets.StepImage_10a}
						imageHighlights={[{ x1: 0.812, y1: 0.873, x2: 0.999, y2: 0.984 }]}
					>
						<p>Click the <strong>Next</strong> button, which will begin the installation. Wait for this process to complete before continuing.</p>
						<p>Note that you may see a summary different from what is shown here.</p>
					</GenericStep>
				),
			},
			{
				id: '5c54627a',
				element: (
					<GenericStep
						multiStepRefs={getRefArray(2)}
						multiStepMarkerPositions={[
							{ x: 0.575, y: 0.83 },
							{ x: 0.787, y: 0.922 },
						]}
						image={assets.StepImage_11a}
					>
						<p>An additional license agreement may appear. If it does, do the following:</p>
						<MultiStepList multiStepRefs={getRefArray(2)}>
							<p>Check <strong>I accept the above 2 license agreements</strong>.</p>
							<p>Click <strong>Next</strong>.</p>
						</MultiStepList>
						<SecondaryButton
							jumpConfig={{ index: 12, toEnd: true }}
							label={'I see no license agreement'}
							action={() => { jumpTo(12); }}
						/>
					</GenericStep>
				),
			},
			{
				id: 'aac6bab9',
				element: (
					<GenericStep
						image={assets.StepImage_12a}
						imageHighlights={[{ x1: 0.812, y1: 0.873, x2: 0.999, y2: 0.984 }]}
					>
						<p>If presented with this screen, click the <strong>Next</strong> button, which will start the final installation process.</p>
					</GenericStep>
				),
			},
			{
				id: '57db1fb1',
				hideStepNumber: true,
				element: (
					<FinalStep
						next={next}
					>
						<p>You've installed the FRC game tools! Your laptop is now equipped with <strong>driver station software</strong>, giving it the ability to connect to the hardware on your robot. Make sure to reboot your laptop before advancing to the next task.</p>
					</FinalStep>
				),
			},
		];
	}

	return stepsRef.current;
}