/**
 * Sales Prep recordings, kept on this device with Call Center Prep's store
 * (IndexedDB: the first take of each prompt, your "before", and the five
 * latest). Prompt ids get a `sales:` prefix so the two sections never mix.
 */
import { listTakes, saveTake, type Take } from '../callCenter/recordings';
import { newId } from '../callCenter/progress';

export const salesPromptKey = (speakId: string) => `sales:${speakId}`;

export const listSalesTakes = (userId: string, speakId: string): Promise<Take[]> => listTakes(userId, salesPromptKey(speakId));

/** Saves a finished recording (from its object URL). */
export async function saveSalesTake(userId: string, speakId: string, url: string): Promise<boolean> {
  try {
    const blob = await (await fetch(url)).blob();
    return await saveTake({ id: newId(), userId, promptId: salesPromptKey(speakId), createdAt: new Date().toISOString(), blob, stats: null });
  } catch {
    return false;
  }
}
