import type { Priority } from '../types';

export const priorityColors: Record<Priority, { bg: string; text: string; dot: string }> = {
  high: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500 dark:bg-red-400' },
  medium: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500 dark:bg-amber-400' },
  low: { bg: 'bg-sage-50 dark:bg-sage-950/30', text: 'text-sage-600 dark:text-sage-400', dot: 'bg-sage-500 dark:bg-sage-400' },
};
