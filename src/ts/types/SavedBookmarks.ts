import { z } from 'zod';

export const SavedBookmarksSchema = z.record(z.string(), z.array(z.number()));

export type SavedBookmarks = z.infer<typeof SavedBookmarksSchema>;