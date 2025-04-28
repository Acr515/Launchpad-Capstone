import type { Config } from 'ts/types/ScreenConfig';
import type { MaterialConfig } from 'ts/types/ModuleData';

/**
 * Retrieves the configuration of a material requirement.
 * @param materialId The ID of the material to search for.
 * @param config The `Application` instance's config object.
 * @returns The material config object; null if the ID can't be found.
 */
const getMaterial = (materialId: string, config: Config): MaterialConfig | null => {
	for (const moduleIndex in config.materials) {
		const material = config.materials[moduleIndex];
		if (material.id === materialId) {
			return material;
		}
	}
	return null;
};

export default getMaterial;