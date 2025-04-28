import { useContext, useRef } from 'react';
import ApplicationContext from 'ts/context/ApplicationContext';
import Button from 'tsx/components/Button';
import FinalStep from 'tsx/components/FinalStep';
import GenericStep from 'tsx/components/GenericStep';
import MultiStepList from 'tsx/components/MultiStepList';
import SecondaryTooltip from 'tsx/components/SecondaryTooltip';
import type StepComponent from 'ts/types/StepComponent';
import type TaskInterfaceOptions from 'ts/types/TaskInterfaceOptions';
import assets from './assets';
import getTask from 'ts/util/getTask';
import images from 'assets/images';
import useMultiStepRefMatrix from 'ts/hooks/useMultiStepRefMatrix';

export default function ImageYourRoboRIO(options: TaskInterfaceOptions): StepComponent[] {
	const multiStepRefMatrix = useMultiStepRefMatrix([2, 5, 5]);
	const application = useContext(ApplicationContext);
	const { jumpTo, colors } = options;
	const next = application !== null ? getTask('3e02818a', application.config) : null;
	const getRefArray = (index: number) => {
		return multiStepRefMatrix.current !== null ? multiStepRefMatrix.current[index] : undefined;
	};
	const stepsRef = useRef<StepComponent[] | null>(null);

	if (stepsRef.current === null) {
		stepsRef.current = [
			{
				id: '3c45f23a',
				subheading: 'Plug In and Test',
				element: (
					<GenericStep>
						<p>Before beginning, make sure that your roboRIO is connected to your <strong>Power Distribution Panel</strong> and that it is powered by a battery.</p>
					</GenericStep>
				),
			},
			{
				id: '731a14f2',
				element: (
					<GenericStep
						image={assets.StepImage_02a}
						imageHighlights={[{ x1: 0.26, y1: 0.02, x2: 0.408, y2: 0.138 }]}
					>
						<p>Once you've verified that your roboRIO is receiving power, connect a USB cable from the USB port in your roboRIO to your laptop.</p>
					</GenericStep>
				),
			},
			{
				id: '7d7117e4',
				element: (
					<GenericStep
						image={assets.StepImage_03a}
						imageHighlights={[{ x1: 0.125, y1: 0.125, x2: 0.872, y2: 0.86 }]}
						imageMaxWidth={10}
					>
						<p>You should see a notification that a device driver is installing. Wait for another notification indicating that the installation is complete before proceeding.</p>
						<p>Once ready, double-click the <strong>roboRIO Imaging Tool</strong> on your desktop to launch it. It was added after you installed the FRC Game Tools.</p>
					</GenericStep>
				),
			},
			{
				id: '1e3e0295',
				element: (
					<GenericStep
						multiStepRefs={getRefArray(0)}
						multiStepMarkerPositions={[
							{ x: 0.3, y: 0.2 },
							{ x: 0.317, y: 0.79 },
						]}
						image={assets.StepImage_04a}
					>
						<p>Once launched, the roboRIO Imaging Tool will scan for any roboRIOs plugged into your laptop.</p>
						<MultiStepList multiStepRefs={getRefArray(0)}>
							<p>Before continuing, verify that a roboRIO target is listed under <strong>roboRIO Targets</strong>. Click on it to select it.</p>
							<p>Take note of the value listed under <strong>Firmware Version</strong> for the next step.</p>
						</MultiStepList>
					</GenericStep>
				),
			},
			{
				id: 'eee75bdc',
				subheading: 'Update and Image',
				element: (
					<GenericStep>
						<p>Is the <strong>firmware version</strong> of your roboRIO as indicated by the imaging tool at least <strong>v5.0.0</strong>?</p>
						<Button {...colors} image={images.icons.check} action={() => jumpTo(6)} label='Yes' secondaryTooltip={<SecondaryTooltip jumpConfig={{ index: 6 }} />}/>
						<Button {...colors} image={images.icons.cross} action={() => jumpTo(5)} label={`No or Don't Know`} style={{ marginLeft: '1em' }} secondaryTooltip={<SecondaryTooltip jumpConfig={{ index: 5 }} />}/>
					</GenericStep>
				),
			},
			{
				id: 'e41d4e0e',
				element: (
					<GenericStep
						multiStepRefs={getRefArray(1)}
						multiStepMarkerPositions={[
							{ x: 0.3, y: 0.2 },
							{ x: 0.77, y: 0.42 },
							{ x: 0.82, y: 0.215 },
							{ x: 0.77, y: 0.575 },
							{ x: 0.765, y: 0.86 },
						]}
						image={assets.StepImage_06a}
					>
						<p>You'll first need to flash the latest firmware to your roboRIO.</p>
						<MultiStepList multiStepRefs={getRefArray(1)}>
							<p>Verify that your roboRIO is highlighted. Click on it if it is not.</p>
							<p>Select <strong>Update Firmware</strong> from the list of options.</p>
							<p>Type your team number into the <strong>Team Number</strong> box.</p>
							<p>Verify that whichever firmware is at the top of the <strong>Select Image</strong> list is highlighted. Click on it if it is not.</p>
							<p>Click <strong>Update</strong>.</p>
						</MultiStepList>
						<p>The process will take some time. Proceed to the next step once it is complete.</p>
					</GenericStep>
				),
			},
			{
				id: '1f1ccccb',
				element: (
					<GenericStep
						multiStepRefs={getRefArray(2)}
						multiStepMarkerPositions={[
							{ x: 0.3, y: 0.2 },
							{ x: 0.77, y: 0.372 },
							{ x: 0.82, y: 0.215 },
							{ x: 0.845, y: 0.575 },
							{ x: 0.765, y: 0.86 },
						]}
						image={assets.StepImage_07a}
					>
						<p>Next, you'll need to image your roboRIO. This must be done as each new season begins. Complete the following steps:</p>
						<MultiStepList multiStepRefs={getRefArray(2)}>
							<p>Verify that your roboRIO is highlighted. Click on it if it is not.</p>
							<p>Select <strong>Format Target</strong> from the list of options.</p>
							<p>Type your team number into the <strong>Team Number</strong> box.</p>
							<p>Verify that whichever firmware is at the top of the <strong>Select Image</strong> list is highlighted. Click on it if it is not.</p>
							<p>Click <strong>Update</strong>.</p>
						</MultiStepList>
						<p>The process will take some time. Proceed to the next step once it is complete.</p>
					</GenericStep>
				),
			},
			{
				id: 'eb623ce0',
				element: (
					<GenericStep
						image={assets.StepImage_02a}
						imageHighlights={[{ x1: 0.26, y1: 0.02, x2: 0.408, y2: 0.138 }]}
					>
						<p>Expect the imaging process to take about 3—10 minutes. The imaging tool will notify you when it is complete; you may close the tool once complete. Before using the roboRIO, press the <strong>Reset</strong> button on it while it is still connected to power.</p>
					</GenericStep>
				),
			},
			{
				id: 'd43214f8',
				hideStepNumber: true,
				element: (
					<FinalStep
						next={next}
					>
						<p>Your roboRIO is now imaged and ready for competition! For good measure, reboot your robot before doing anything else with the roboRIO to ensure that the new software is applied.</p>
					</FinalStep>
				),
			},
		];
	}

	return stepsRef.current;
}