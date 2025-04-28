import { type SavedBookmarks, SavedBookmarksSchema } from 'ts/types/SavedBookmarks';
import { type Settings, SettingsSchema, defaultSettings } from 'ts/types/Settings';
import parse, { parseAppConfig } from 'ts/util/parse';
import type BackgroundType from 'ts/types/BackgroundType';
import { Config } from 'ts/types/ScreenConfig';
import type { ModuleConfig } from 'ts/types/ModuleData';
import Router from './Router';
import type ScreenProps from 'ts/types/ScreenProps';
import { type StarryCanvasObject } from 'ts/hooks/useStarryCanvas';
import type StateObject from 'ts/types/StateObject';
import images from 'assets/images';
import loadImage from 'ts/util/loadImage';
import taskMap from 'config/taskMap';

type AppStateRegistrationData = {
	screenStack: StateObject<string[]>;
	screenProps: StateObject<ScreenProps[]>;
	stackIndex: StateObject<number>;
	previousStackIndex: StateObject<number>;
	activeBackground: StateObject<BackgroundType>;
	activeModule: StateObject<ModuleConfig | null>;
	savedBookmarks: StateObject<SavedBookmarks>;
	settings: StateObject<Settings>;
};

type FrameStateRegistrationData = {
	stars: StarryCanvasObject;
};

const LOCALSTORAGE_BOOKMARK_KEY = 'launchpad_bookmarks';
const LOCALSTORAGE_SETTINGS_KEY = 'settings';

/**
 * Responsible for managing high-level state and configuration data. Initialized in App.tsx.
 */
export default class Application {
	public readonly config: Config;
	public readonly router: Router;
	public readonly production = process.env.NODE_ENV === 'production';
	private _activeBackground: StateObject<BackgroundType> | null = null;
	private _activeModule: StateObject<ModuleConfig | null> | null = null;
	private _savedBookmarks: StateObject<SavedBookmarks> | null = null;
	private _settings: StateObject<Settings> | null = null;
	private _stars: StarryCanvasObject | null = null;

	constructor(
		config: unknown,
	) {
		// Parse config and create router
		this.config = parseAppConfig(config);
		this.router = new Router(this);
	}

	get stars(): StarryCanvasObject | null { return this._stars; }

	get activeBackground(): BackgroundType { return this._activeBackground?.value ?? 'neutral'; }

	get activeModule(): ModuleConfig | null { return this._activeModule?.value ?? null; }

	get settings(): Settings { return this._settings?.value ?? defaultSettings; }

	/**
	 * Blocks execution of current thread until core assets, primarily images,
	 * are loaded.
	 */
	async preloadCoreAssets(): Promise<void> {
		const promises: Promise<unknown>[] = [];

		// Wait for typefaces to load before advancing
		promises.push(document.fonts.ready);

		// Preload module icons
		for (const [index, mod] of images.modules.entries()) {
			promises.push(
				loadImage(`mod${index + 1}-blur`, mod.blur),
				loadImage(`mod${index + 1}-focus`, mod.focus),
			);
		}

		// Preload graphics
		for (const [name, data] of Object.entries(images.graphics)) {
			promises.push(loadImage(name, data));
		}

		await Promise.all(promises);
	}

	/**
	 * Consumes and distributes state data from the `App` component.
	 * @param state The state values to distribute.
	 */
	registerAppState(state: AppStateRegistrationData): void {
		this.router.assignState(state.screenStack, state.screenProps, state.stackIndex, state.previousStackIndex);
		this._activeBackground = state.activeBackground;
		this._activeModule = state.activeModule;
		this._savedBookmarks = state.savedBookmarks;
		this._settings = state.settings;
	}

	/**
	 * Consumes and distributes state data from the `Frame` component.
	 * @param state The state values to distribute.
	 */
	registerFrameState(state: FrameStateRegistrationData): void {
		this._stars = state.stars;
	}

	/**
	 * Changes the frame's active background.
	 * @param background The background type to assign.
	 * @param module The current active module. If omitted, does not change this property.
	 * Explicit null argument indicates that the screen is module-agnostic.
	 */
	setActiveBackground(background: BackgroundType, module?: ModuleConfig | null): void {
		this._activeBackground?.set(background);
		if (typeof module !== 'undefined') { this._activeModule?.set(module); }
	}

	/**
	 * Gets bookmarks saved in local storage. If there are none, or the data is corrupted, returns
	 * an empty set of bookmarks.
	 * @returns A `Record` with bookmarks indexed by their associated task.
	 */
	getSavedBookmarks(): SavedBookmarks {
		if (this.config.metadata.demo) { return this.getBookmarkTemplate(); }
		const bookmarksString = localStorage.getItem(LOCALSTORAGE_BOOKMARK_KEY);
		if (bookmarksString !== null) {
			const parsedBookmarks = parse<SavedBookmarks>(JSON.parse(bookmarksString), SavedBookmarksSchema);
			if (parsedBookmarks !== null) {
				return parsedBookmarks;
			} else {
				return this.getBookmarkTemplate();
			}
		} else {
			return this.getBookmarkTemplate();
		}
	}

	/**
	 * Gets the bookmarks associated with a task.
	 * @param taskId The task to get bookmarks for.
	 * @returns An array of indexes with saved bookmarks. If unavailable, returns an empty array.
	 */
	getTaskBookmarks(taskId: string): number[] {
		if (this._savedBookmarks === null) { return []; }
		return this._savedBookmarks.value[taskId] ?? [];
	}

	/**
	 * Adds or removes a bookmark and commits the change to local storage.
	 * @param taskId The ID of the task, which is specified in the task's config and used to index components in the `taskMap`.
	 * @param index The index within the step to address.
	 * @param value True to add a bookmark, false to remove. If omitted, toggles the bookmark.
	 */
	setBookmark(taskId: string, index: number, value?: boolean): void {
		if (this._savedBookmarks === null) { return; }
		const bookmarks = { ...this._savedBookmarks.value };
		const bookmarkSet = bookmarks[taskId];
		const bookmarkValue = bookmarkSet.includes(index);
		if (value === bookmarkValue) { return; }
		if (typeof value !== 'undefined') {
			if (value) {
				bookmarkSet.push(index);
			} else {
				bookmarkSet.splice(bookmarkSet.indexOf(index), 1);
			}
		} else {
			if (!bookmarkValue) {
				bookmarkSet.push(index);
			} else {
				bookmarkSet.splice(bookmarkSet.indexOf(index), 1);
			}
		}
		this._savedBookmarks.set(bookmarks);
		if (!this.config.metadata.demo) {
			localStorage.setItem(LOCALSTORAGE_BOOKMARK_KEY, JSON.stringify(bookmarks));
		}
	}

	private getBookmarkTemplate(): SavedBookmarks {
		const bookmarkedSteps: SavedBookmarks = {};
		for (const key of Object.keys(taskMap)) {
			bookmarkedSteps[key] = [];
		}
		return bookmarkedSteps;
	}

	/**
	 * Retrieves settings from local storage.
	 */
	getSettings(): Settings {
		const settingString = localStorage.getItem(LOCALSTORAGE_SETTINGS_KEY);
		if (settingString !== null) {
			const parsedSettings = parse<Settings>(JSON.parse(settingString), SettingsSchema);
			if (parsedSettings !== null) {
				return parsedSettings;
			} else {
				return defaultSettings;
			}
		} else {
			return defaultSettings;
		}
	}

	/**
	 * Updates the settings.
	 */
	updateSettings(settings: Settings) {
		if (this._settings === null) { return; }
		this._settings.set(settings);
		localStorage.setItem(LOCALSTORAGE_SETTINGS_KEY, JSON.stringify(settings));
	}
}