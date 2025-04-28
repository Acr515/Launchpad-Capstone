/**
 * Makes a request to load an image.
 * @param name The name of the image; isn't being used right now but would be a
 * good way to index files that are causing errors.
 * @param src The image source.
 * @returns A `Promise` that resolves when the image is loaded.
 */
const loadImage = (_: string, src: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve();
		image.onerror = reject;
		image.src = src;
	});
};

export default loadImage;