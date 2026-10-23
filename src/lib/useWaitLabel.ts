import { useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { formatWait } from './srs';

/** Interval labels in the current language ("10m", "2d", "١٠ د" …). */
export function useWaitLabel() {
  const { t } = useTranslation();
  return useCallback(
    (ms: number) =>
      formatWait(ms, {
        m: t('vocabulary.srs.unit.m'),
        h: t('vocabulary.srs.unit.h'),
        d: t('vocabulary.srs.unit.d'),
        mo: t('vocabulary.srs.unit.mo'),
        y: t('vocabulary.srs.unit.y'),
      }),
    [t]
  );
}
