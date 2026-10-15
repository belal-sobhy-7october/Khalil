import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from './useTranslation';

describe('tn (counted text)', () => {
  it('uses singular and Arabic dual forms, and the plain text otherwise', () => {
    useAppStore.setState({ language: 'en' });
    let { result } = renderHook(() => useTranslation());
    expect(result.current.tn('vocabulary.quickAdd.save', 1)).toBe('Add 1 word');
    expect(result.current.tn('vocabulary.quickAdd.save', 2)).toBe('Add 2 words');
    expect(result.current.tn('vocabulary.wrongCount', 1)).toBe('Wrong once');
    expect(result.current.tn('vocabulary.wrongCount', 3)).toBe('Wrong 3 times');

    useAppStore.setState({ language: 'ar' });
    ({ result } = renderHook(() => useTranslation()));
    expect(result.current.tn('vocabulary.wrongCount', 1)).toBe('خطأ مرة واحدة');
    expect(result.current.tn('vocabulary.wrongCount', 2)).toBe('خطأ مرتين');
    expect(result.current.tn('vocabulary.wrongCount', 5)).toBe('خطأ 5 مرات');
  });
});
