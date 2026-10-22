/** Opens another part of Khalil from Call Center Prep. */

/** Opens a tab of the English hub ("vocabulary" for the flashcards, "pronunciation", …). */
export function openEnglishTab(tab: string) {
  try {
    localStorage.setItem('khalil-english-tab', tab);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('khalil:navigate', { detail: 'vocabulary' }));
}

export const openFlashcards = () => openEnglishTab('vocabulary');
