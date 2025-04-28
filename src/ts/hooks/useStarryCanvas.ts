import { useRef } from 'react';

/** The base size of each star. */
const STAR_SIZE = 1;
/** The minimum size of a star. */
const STAR_MIN_SCALE = 0.15;
/** The maximum size of a star. */
const STAR_MAX_SCALE = 1.45;
/** When recycling stars because of z velocity, star size varies by this amount */
const STAR_RECYCLE_Z_VARIANCE = 0.4;
/** When z velocity is in reverse, stars within this value of min size are told to recycle prematurely. */
const STAR_ZOOM_EXPIRE_Z_THRESHOLD = 0.3;
/** In pixels, the amount of padding around the window to check for stars going out of bounds. */
const OVERFLOW_THRESHOLD = 10;
/** Factor to use to determine the number of stars to draw; higher number indicates more stars */
const STAR_COUNT = 0.09;
/** A factor between 0 and 1 that determines how quickly x and y star motion is slowed. */
const VELOCITY_XY_REGRESSION_FACTOR = 0.55;
/** A factor between 0 and 1 that determines how quickly z star motion is slowed. */
const VELOCITY_Z_REGRESSION_FACTOR = 0.945;
/** A factor between 0 and 1 that determines how quickly stars move along the x and y axes. */
const MOTION_XY_REGRESSION_FACTOR = 0.8;
/** A factor between 0 and 1 that determines how quickly stars move along the z axis. */
const MOTION_Z_REGRESSION_FACTOR = 0.025;
/** The minimum z velocity of the canvas scene. */
const MIN_Z = 0.00025;

type Star = {
	x: number;
	y: number;
	z: number;
};

type CanvasLocation = {
	x: number | null;
	y: number | null;
	z: number | null;
};

type Coordinates = {
	x?: number;
	y?: number;
	z?: number;
};

type ScreenDimensions = {
	scale: number;
	width: number;
	height: number;
};

type Velocity = {
	x: number;
	y: number;
	z: number;
	tx: number;
	ty: number;
	tz: number;
};

export type StarryCanvasObject = {
	attach: () => void;
	detach: () => void;
	move: (coordinates: Coordinates) => void;
	moveDelta: (coordinates: Coordinates) => void;
	updateOpacity: (opacity: number) => void;
	canvas: HTMLCanvasElement | null;
};

/**
 * Draws a constellation of dots onto a canvas. By default their opacity begins at 0;
 * call `updateOpacity` to change that.
 * @param canvas The canvas element upon which to draw the stars.
 * @returns A `StarryCanvasObject`, which contains controls for the canvas.
 */
export default function useStarryCanvas(canvas: HTMLCanvasElement | null): StarryCanvasObject {
	const stars = useRef<Star[]>([]);
	const renderLoopFrame = useRef<number | null>(null);
	const dimensions = useRef<ScreenDimensions>({ scale: 1, width: 0, height: 0 });
	const location = useRef<CanvasLocation>({ x: 0, y: 0, z: 0 });
	const velocity = useRef<Velocity>({ x: 0, y: 0, z: MIN_Z, tx: 0, ty: 0, tz: 0 });
	const context = canvas?.getContext('2d', { alpha: false }) ?? null;

	/**
	 * Attaches event handlers and begins the render loop.
	 */
	const attach = (): void => {
		if (canvas === null) { return; }
		if (renderLoopFrame.current !== null) { return; }
		velocity.current = { x: 0, y: 0, z: MIN_Z, tx: 0, ty: 0, tz: 0 };
		window.addEventListener('resize', resize);
		resize();
		renderLoop(performance.now());
	};

	/**
	 * Removes the event handlers and stops the render loop.
	 */
	const detach = (): void => {
		stars.current = [];
		window.removeEventListener('resize', resize);
		if (renderLoopFrame.current !== null) { cancelAnimationFrame(renderLoopFrame.current); }
		renderLoopFrame.current = null;
		context?.reset();
	};

	/**
	 * Listens for window resizes and adjusts the stars accordingly.
	 */
	const resize = () => {
		if (canvas === null) { return; }
		const scale = window.devicePixelRatio || 1;
		const width = window.innerWidth * scale;
		const height = window.innerHeight * scale;
		canvas!.width = width;
		canvas!.height = height;

		dimensions.current = { scale, width, height };
		const newStars = generate();
		newStars.forEach((star: Star): void => {
			star.x = Math.random() * dimensions.current.width;
			star.y = Math.random() * dimensions.current.height;
		});
		stars.current = newStars;
	};

	/**
	 * Sets the position of the stars relative to their current focal point.
	 * @param coordinates How far to move the focal point of the stars.
	 */
	const moveDelta = (coordinates: Coordinates) => {
		for (const key of Object.keys(coordinates)) {
			if ((key !== 'x' && key !== 'y' && key !== 'z') || typeof coordinates[key] === 'undefined') { continue; }
			const currentValue = location.current[key] ?? 0;
			coordinates[key] = currentValue + coordinates[key];
		}
		move(coordinates);
	};

	/**
	 * Sets the position of the stars.
	 * @param coordinates Where to move the focal point of the stars to.
	 */
	const move = (coordinates: Coordinates): void => {
		const { x, y, z } = coordinates;

		if (location.current.x !== null && location.current.y !== null && location.current.z !== null) {
			if (typeof x !== 'undefined') {
				const deltaX = x - location.current.x;
				velocity.current.tx = velocity.current.tx + (deltaX / 8 * dimensions.current.scale) * -1;
			}
			if (typeof y !== 'undefined') {
				const deltaY = y - location.current.y;
				velocity.current.ty = velocity.current.ty + (deltaY / 8 * dimensions.current.scale) * -1;
			}
			if (typeof z !== 'undefined') {
				const deltaZ = z - location.current.z;
				velocity.current.tz = deltaZ;
			}
		}
		location.current = { x: x ?? 0, y: y ?? 0, z: z ?? 0 };
	};

	/**
	 * Updates the canvas's opacity.
	 * @param opacity A number between 0 and 1 to set the opacity to.
	 */
	const updateOpacity = (opacity: number): void => {
		if (canvas === null) { return; }
		canvas.style.opacity = `${opacity}`;
	};

	/**
	 * Appropriately moves a star when it leaves the viewport or becomes too small.
	 * @param star The star to recycle.
	 */
	const recycleStar = (star: Star): void => {
		let direction = 'z';
		const { width, height } = dimensions.current;

		const vx = Math.abs(velocity.current.x),
			vy = Math.abs(velocity.current.y);

		if (vx > 1 || vy > 1) {
			let axis;
			if (vx > vy) {
				axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
			} else {
				axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
			}
			if (axis === 'h') {
				direction = velocity.current.x > 0 ? 'l' : 'r';
			} else {
				direction = velocity.current.y > 0 ? 't' : 'b';
			}
		}

		if (Math.abs(velocity.current.z) > MIN_Z * 100) { direction = 'z'; }
		if (direction !== 'z') {
			star.z = STAR_MIN_SCALE + Math.random() * (STAR_MAX_SCALE - STAR_MIN_SCALE);
		}

		switch (direction) {
			case 'z': {
				const out = Math.sign(velocity.current.z) === -1;
				star.z = out ? STAR_MAX_SCALE - Math.random() * STAR_RECYCLE_Z_VARIANCE : STAR_MIN_SCALE + Math.random() * STAR_RECYCLE_Z_VARIANCE;
				if (out) {
					const anchor = ['t', 'b', 'l', 'r'][Math.round(Math.random() * 3)];
					switch (anchor) {
						case 't':
							star.x = Math.random() * width;
							star.y = -OVERFLOW_THRESHOLD;
							break;
						case 'b':
							star.x = Math.random() * width;
							star.y = height;
							break;
						case 'l':
							star.x = -OVERFLOW_THRESHOLD;
							star.y = Math.random() * height;
							break;
						case 'r':
							star.x = width;
							star.y = Math.random() * height;
							break;
					}
				} else {
					star.x = Math.random() * width;
					star.y = Math.random() * height;
				}
				break;
			}
			case 't':
				star.x = Math.random() * width;
				star.y = -OVERFLOW_THRESHOLD;
				break;
			case 'b':
				star.x = Math.random() * width;
				star.y = height;
				break;
			case 'l':
				star.x = -OVERFLOW_THRESHOLD;
				star.y = Math.random() * height;
				break;
			case 'r':
				star.x = width;
				star.y = Math.random() * height;
				break;
		}
	};

	/**
	 * The main animation loop, which runs every step while attached.
	 */
	const renderLoop = (timestamp: number) => {
		if (canvas === null) { return; }
		renderLoopFrame.current = requestAnimationFrame(renderLoop);
		const deltaTime = performance.now() - timestamp;
		if (deltaTime < 0) { return; }

		canvas.width = dimensions.current.width;
		update(deltaTime);
		render();
	};

	/**
	 * Runs continuously to update the position and color of all stars.
	 */
	const update = (deltaTime: number): void => {
		const { width, height } = dimensions.current;
		velocity.current.tx *= VELOCITY_XY_REGRESSION_FACTOR;
		velocity.current.ty *= VELOCITY_XY_REGRESSION_FACTOR;
		velocity.current.tz *= VELOCITY_Z_REGRESSION_FACTOR;

		velocity.current.x += (velocity.current.tx - velocity.current.x) * MOTION_XY_REGRESSION_FACTOR ** deltaTime;
		velocity.current.y += (velocity.current.ty - velocity.current.y) * MOTION_XY_REGRESSION_FACTOR ** deltaTime;
		velocity.current.z += (velocity.current.tz - velocity.current.z) * MOTION_Z_REGRESSION_FACTOR ** deltaTime;

		// Always keep stars in z motion
		if (Math.sign(velocity.current.z) === -1) {
			if (velocity.current.z > -MIN_Z) { velocity.current.z = MIN_Z; }
		} else {
			velocity.current.z = Math.max(velocity.current.z, MIN_Z);
		}

		for (const star of stars.current) {
			star.x += velocity.current.x * star.z;
			star.y += velocity.current.y * star.z;

			star.x += (star.x - width / 2) * velocity.current.z * star.z;
			star.y += (star.y - height / 2) * velocity.current.z * star.z;
			star.z += velocity.current.z;

			// Recycle when out of bounds
			if (star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
				recycleStar(star);
			} else if (star.z <= STAR_MIN_SCALE || (Math.abs(velocity.current.z) === -1 && star.z <= STAR_ZOOM_EXPIRE_Z_THRESHOLD)) {
				recycleStar(star);
			}
		}
	};

	/**
	 * Draws all stars on the screen.
	 */
	const render = (): void => {
		if (context === null) { return; }

		context.lineCap = 'round';
		context.strokeStyle = '#ddd';
		context.lineWidth = 2;

		for (const star of stars.current) {
			context.beginPath();
			context.lineWidth = STAR_SIZE * star.z * dimensions.current.scale;

			let tailX = velocity.current.x * (star.z * 2) + ((dimensions.current.width / 2 - star.x) * velocity.current.z),
				tailY = velocity.current.y * (star.z * 2) + ((dimensions.current.height / 2 - star.y) * velocity.current.z);

			if (Math.abs(tailX) < 0.1) tailX = 1;
			if (Math.abs(tailY) < 0.1) tailY = 1;

			context.moveTo(star.x, star.y);
			context.lineTo(star.x + tailX, star.y + tailY);
			context.stroke();
		}
	};

	return {
		attach,
		detach,
		move,
		moveDelta,
		updateOpacity,
		canvas,
	};
}

function generate() {
	const stars: Star[] = [];
	const starCount = Math.round((window.innerWidth + window.innerHeight) * STAR_COUNT);
	for (let i = 0; i < starCount; i++) {
		stars.push({
			x: 0,
			y: 0,
			z: STAR_MIN_SCALE + Math.random() * (STAR_MAX_SCALE - STAR_MIN_SCALE),
		});
	}
	return stars;
}