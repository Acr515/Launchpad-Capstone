import BubbleShadow from './graphics/bubble-shadow.png';
import HelpCD from './help/icons/cd.png';
import HelpCDPreview from './help/icons/cd-preview.png';
import HelpCompass from './help/icons/compass.png';
import HelpCompassPreview from './help/icons/compass-preview.jpg';
import HelpDiscord from './help/icons/discord.png';
import HelpDiscordPreview from './help/icons/discord-preview.jpg';
import IconBack from './icons/back.svg';
import IconBlockArrow from './icons/block-arrow.svg';
import IconBookmark from './icons/bookmark.svg';
import IconBookmarkFilled from './icons/bookmark-filled.svg';
import IconCheck from './icons/check.svg';
import IconChevron from './icons/chevron.svg';
import IconClipboard from './icons/clipboard.svg';
import IconCross from './icons/cross.svg';
import IconDownArrow from './icons/down-arrow.svg';
import IconGear from './icons/gear.svg';
import IconInfo from './icons/info.svg';
import IconLink from './icons/link.svg';
import IconQuestion from './icons/question.svg';
import MaterialLaptop from './materials/laptop.svg';
import MaterialMotorController from './materials/motor-controller.svg';
import MaterialRadio from './materials/radio.svg';
import MaterialRoborio from './materials/roborio.svg';
import MaterialRobot from './materials/robot.svg';
import Module1Blur from './modules/module-1-blur.png';
import Module1Focus from './modules/module-1-focus.png';
import Module2Blur from './modules/module-2-blur.png';
import Module2Focus from './modules/module-2-focus.png';
import Module3Blur from './modules/module-3-blur.png';
import Module3Focus from './modules/module-3-focus.png';
import Module4Blur from './modules/module-4-blur.png';
import Module4Focus from './modules/module-4-focus.png';
import Module5Blur from './modules/module-5-blur.png';
import Module5Focus from './modules/module-5-focus.png';
import Onboard1 from './graphics/onboard-1.png';
import Onboard2 from './graphics/onboard-2.png';
import Onboard3 from './graphics/onboard-3.png';
import Onboard4 from './graphics/onboard-4.png';
import ProgressTrackerThumbnail from './graphics/progress-tracker-thumbnail.jpg';
import Wordmark from './graphics/wordmark.svg';

const images = {
	icons: {
		back: IconBack,
		blockArrow: IconBlockArrow,
		bookmark: IconBookmark,
		bookmarkFilled: IconBookmarkFilled,
		check: IconCheck,
		chevron: IconChevron,
		clipboard: IconClipboard,
		cross: IconCross,
		downArrow: IconDownArrow,
		info: IconInfo,
		link: IconLink,
		question: IconQuestion,
		gear: IconGear,
	},
	materials: {
		'laptop': MaterialLaptop,
		'motor-controller': MaterialMotorController,
		'radio': MaterialRadio,
		'roborio': MaterialRoborio,
		'robot': MaterialRobot,
	},
	modules: [
		{
			blur: Module1Blur,
			focus: Module1Focus,
		},
		{
			blur: Module2Blur,
			focus: Module2Focus,
		},
		{
			blur: Module3Blur,
			focus: Module3Focus,
		},
		{
			blur: Module4Blur,
			focus: Module4Focus,
		},
		{
			blur: Module5Blur,
			focus: Module5Focus,
		},
	],
	graphics: {
		wordmark: Wordmark,
		bubbleShadow: BubbleShadow,
		onboard1: Onboard1,
		onboard2: Onboard2,
		onboard3: Onboard3,
		onboard4: Onboard4,
		progressTrackerThumbnail: ProgressTrackerThumbnail,
	},
	help: {
		icons: {
			cd: HelpCD,
			compass: HelpCompass,
			discord: HelpDiscord,
		},
		screenshots: {
			cd: HelpCDPreview,
			compass: HelpCompassPreview,
			discord: HelpDiscordPreview,
		},
	},
};

export default images;