import { useState, useRef, useEffect } from 'react';
import { X, Upload, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { parseVocabularyText, detectDuplicates, type ParsedRow } from '../../lib/vocabularyImport';
import type { VocabularyItemType } from '../../types';
import { useDialog } from '../../lib/useDialog';

type Step = 'input' | 'preview' | 'importing' | 'done';

interface RowState extends ParsedRow {
  id: string;
  selected: boolean;
  status: 'new' | 'duplicate' | 'warning';
  edited: boolean;
}

export default function ImportWordsModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);
  
  const [step, setStep] = useState<Step>('input');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<RowState[]>([]);
  const [defaultType, setDefaultType] = useState<VocabularyItemType>('word');
  const [showFormats, setShowFormats] = useState(false);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [updateDuplicates, setUpdateDuplicates] = useState(false);
  const [categoryForAll, setCategoryForAll] = useState<string | undefined>(undefined);
  const [typeForAll, setTypeForAll] = useState<VocabularyItemType | undefined>(undefined);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ inserted: number; updated: number; skipped: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (step === 'input') {
      textareaRef.current?.focus();
    }
  }, [step]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setInputText(ev.target?.result as string);
      };
      reader.readAsText(f);
    }
  };

  const tWithCount = (key: string, count: number) => t(key).replace('{count}', String(count)).replace('{progress}', String(count));
  
  const handleParse = () => {
    if (!inputText.trim()) return;
    setError(null);
    const result = parseVocabularyText(inputText, { defaultType });
    
    if (result.rows.length === 0 && result.errors.some(e => e.severity === 'error')) {
      setError(result.errors.find(e => e.severity === 'error')?.message || t('vocabulary.import.parseFailed'));
      return;
    }
    
    const existingWords = new Set(vocabularyItems.map(i => i.word.toLowerCase()));
    const rowStates: RowState[] = result.rows.map((r, idx) => {
      const lower = r.word.toLowerCase();
      let status: RowState['status'] = 'new';
      if (existingWords.has(lower)) status = 'duplicate';
      else if (r.warnings.length > 0) status = 'warning';
      
      return {
        ...r,
        id: `row-${idx}`,
        selected: status !== 'duplicate' || !skipDuplicates,
        status,
        edited: false,
      };
    });
    
    detectDuplicates(rowStates, existingWords);
    setRows(rowStates);
    setStep('preview');
  };
  
  const updateRow = (id: string, field: keyof RowState, value: unknown) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value, edited: true } : r));
  };
  
  const toggleRowSelection = (id: string) => {
    setRows(prev => prev.map(r => 
      r.id === id ? { ...r, selected: !r.selected } : r
    ));
  };
  
  const toggleAllSelection = () => {
    const allSelected = rows.every(r => r.selected);
    setRows(prev => prev.map(r => ({ ...r, selected: !allSelected })));
  };
  
  const applyCategoryToSelected = (catId: string | undefined) => {
    setRows(prev => prev.map(r => 
      r.selected ? { ...r, categoryName: catId, edited: true } : r
    ));
    setCategoryForAll(catId);
  };
  
  const applyTypeToSelected = (type: VocabularyItemType | undefined) => {
    setRows(prev => prev.map(r => 
      r.selected ? { ...r, type: type || defaultType, edited: true } : r
    ));
    setTypeForAll(type);
  };
  
  const handleImport = async () => {
    const selectedRows = rows.filter(r => r.selected);
    if (selectedRows.length === 0) return;
    
    setStep('importing');
    setImportProgress(0);
    setError(null);
    
    try {
      const items = selectedRows.map(r => ({
        word: r.word,
        type: r.type,
        definition: r.definition,
        exampleSentence: r.exampleSentence,
        pronunciation: r.pronunciation,
        categoryName: r.categoryName,
        masteryLevel: 0,
      }));
      
      const result = await importVocabularyItems(items, { 
        duplicateMode: updateDuplicates ? 'update' : 'skip',
        categoryForAll,
        typeForAll,
      });
      
      setImportResult(result);
      setStep('done');
    } catch {
      setError(t('errors.importVocabulary'));
      setStep('preview');
    }
  };
  
  const handleClose = () => {
    if (step === 'importing') return;
    onClose();
  };
  
  const selectedCount = rows.filter(r => r.selected).length;
  const newCount = rows.filter(r => r.status === 'new' && r.selected).length;
  const duplicateCount = rows.filter(r => r.status === 'duplicate' && r.selected).length;
  const warningCount = rows.filter(r => r.status === 'warning' && r.selected).length;
  
  const dialog = useDialog(onClose);

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div {...dialog.props} className="bg-card border border-border-subtle rounded-2xl w-full max-w-5xl max-h-[90svh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-card border-b border-border-subtle px-6 py-4 flex items-center justify-between">
          <h2 id={dialog.titleId} className="text-xl font-bold text-ink">{t('vocabulary.importWords')}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
            aria-label={t('common.close')}
          >
            <X size={20} className="text-ink-light" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  {t('vocabulary.import.pasteHere')}
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('vocabulary.import.pastePlaceholder')}
                    rows={12}
                    dir="auto"
                    className="w-full px-4 py-3 bg-ink/5 border border-border-subtle rounded-lg text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft resize-y font-mono text-sm"
                  />
                  {file && (
                    <div className="absolute top-2 end-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Check size={12} />
                      {file.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt,.csv,.tsv,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="import-file"
                />
                <label htmlFor="import-file" className="flex items-center gap-2 px-4 py-2 bg-ink/5 text-ink border border-border-subtle rounded-lg hover:bg-ink/10 transition-colors cursor-pointer">
                  <Upload size={18} />
                  <span>{t('vocabulary.import.uploadFile')}</span>
                </label>
                <span className="text-sm text-ink-light">{t('vocabulary.import.fileTypes')}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-ink">{t('vocabulary.import.defaultType')}</label>
                <select
                  value={defaultType}
                  onChange={(e) => setDefaultType(e.target.value as VocabularyItemType)}
                  className="px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
                >
                  <option value="word">{t('vocabulary.typeWord')}</option>
                  <option value="verb">{t('vocabulary.typeVerb')}</option>
                  <option value="idiom">{t('vocabulary.typeIdiom')}</option>
                  <option value="phrase">{t('vocabulary.typePhrase')}</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowFormats(!showFormats)}
                className="flex items-center gap-2 py-1 text-sm text-clay-soft hover:text-clay-soft-dark"
              >
                {showFormats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span>{showFormats ? t('vocabulary.import.hideFormats') : t('vocabulary.import.showFormats')}</span>
              </button>
              
              {showFormats && (
                <div className="bg-ink/5 rounded-xl p-4 space-y-4 text-sm">
                  <h4 className="font-medium text-ink">{t('vocabulary.import.supportedFormats')}</h4>
                  <div className="space-y-3 font-mono text-xs bg-ink/10 rounded-lg p-3 overflow-x-auto">
                    <div className="font-medium mb-2">{t('vocabulary.import.formatJson')}</div>
                    <pre>{`[
  { "word": "hello", "type": "word", "definition": "A greeting", "example": "Hello world", "pronunciation": "həˈləʊ", "category": "Basics" }
]`}</pre>
                  </div>
                  <div className="font-mono text-xs bg-ink/10 rounded-lg p-3 overflow-x-auto">
                    <div className="font-medium mb-2">{t('vocabulary.import.formatCsv')}</div>
                    <pre>{`word,type,definition,example,pronunciation,category
hello,word,A greeting,Hello world,həˈləʊ,Basics`}</pre>
                  </div>
                  <div className="font-mono text-xs bg-ink/10 rounded-lg p-3 overflow-x-auto">
                    <div className="font-medium mb-2">{t('vocabulary.import.formatNumbered')}</div>
                    <pre>{`1. Reliable — يُعتمد عليه
She's very reliable...
هي شخص يُعتمد عليه...
B1`}</pre>
                  </div>
                  <div className="font-mono text-xs bg-ink/10 rounded-lg p-3 overflow-x-auto">
                    <div className="font-medium mb-2">{t('vocabulary.import.formatTab')}</div>
                    <pre>{`Come across as\tمعنى\tHe comes across as confident. — يعطي انطباعًا...`}</pre>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleParse}
                disabled={!inputText.trim()}
                className="w-full px-6 py-3 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('vocabulary.import.parse')}
              </button>
            </div>
          )}
          
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-ink">{t('vocabulary.import.preview')}</h3>
                <div className="flex items-center gap-4 text-sm text-ink-light">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded" />
                    {tWithCount('vocabulary.import.newWord', newCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-orange-500 rounded" />
                    {tWithCount('vocabulary.import.duplicates', duplicateCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-yellow-500 rounded" />
                    {tWithCount('vocabulary.import.warnings', warningCount)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rows.length > 0 && rows.every(r => r.selected)}
                    onChange={toggleAllSelection}
                    className="w-4 h-4 rounded border-border-subtle text-clay-soft focus:ring-clay-soft"
                  />
                  <span className="text-sm text-ink">{selectedCount === rows.length ? t('vocabulary.import.deselectAll') : t('vocabulary.import.selectAll')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skipDuplicates}
                    onChange={(e) => {
                      setSkipDuplicates(e.target.checked);
                      setRows(prev => prev.map(r => r.status === 'duplicate' ? { ...r, selected: !e.target.checked } : r));
                    }}
                    className="w-4 h-4 rounded border-border-subtle text-clay-soft focus:ring-clay-soft"
                  />
                  <span className="text-sm text-ink">{t('vocabulary.import.skipDuplicates')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={updateDuplicates}
                    onChange={(e) => setUpdateDuplicates(e.target.checked)}
                    className="w-4 h-4 rounded border-border-subtle text-clay-soft focus:ring-clay-soft"
                  />
                  <span className="text-sm text-ink">{t('vocabulary.import.updateDuplicates')}</span>
                </label>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-ink-light">{t('vocabulary.import.categoryForAll')}</label>
                  <select
                    value={categoryForAll || ''}
                    onChange={(e) => applyCategoryToSelected(e.target.value || undefined)}
                    className="px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
                  >
                    <option value="">{t('vocabulary.noCategory')}</option>
                    {vocabularyCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="__new__">{t('vocabulary.import.createNewCategory')}</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-ink-light">{t('vocabulary.import.typeForAll')}</label>
                  <select
                    value={typeForAll || ''}
                    onChange={(e) => applyTypeToSelected(e.target.value as VocabularyItemType | undefined)}
                    className="px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
                  >
                    <option value="">{t('vocabulary.import.keepCurrent')}</option>
                    <option value="word">{t('vocabulary.typeWord')}</option>
                    <option value="verb">{t('vocabulary.typeVerb')}</option>
                    <option value="idiom">{t('vocabulary.typeIdiom')}</option>
                    <option value="phrase">{t('vocabulary.typePhrase')}</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card border-b border-border-subtle">
                    <tr>
                      <th className="px-3 py-2 text-start w-10">
                        <input
                          type="checkbox"
                          checked={selectedCount === rows.length && rows.length > 0}
                          onChange={toggleAllSelection}
                          className="w-4 h-4 rounded border-border-subtle text-clay-soft focus:ring-clay-soft"
                        />
                      </th>
                      <th className="px-3 py-2 text-start">{t('vocabulary.word')}</th>
                      <th className="px-3 py-2 text-start">{t('vocabulary.type')}</th>
                      <th className="px-3 py-2 text-start">{t('vocabulary.definition')}</th>
                      <th className="px-3 py-2 text-start">{t('vocabulary.exampleSentence')}</th>
                      <th className="px-3 py-2 text-start">{t('vocabulary.pronunciation')}</th>
                      <th className="px-3 py-2 text-start">{t('vocabulary.category')}</th>
                      <th className="px-3 py-2 text-start">{t('vocabulary.import.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-b border-border-subtle/50 hover:bg-ink/5">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={() => toggleRowSelection(row.id)}
                            disabled={row.status === 'duplicate' && skipDuplicates}
                            className="w-4 h-4 rounded border-border-subtle text-clay-soft focus:ring-clay-soft disabled:opacity-50"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.word}
                            onChange={(e) => updateRow(row.id, 'word', e.target.value)}
                            className="w-full px-2 py-1 bg-ink/5 border border-border-subtle rounded text-ink text-sm focus:outline-none focus:border-clay-soft"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={row.type}
                            onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                            className="px-2 py-1 bg-ink/5 border border-border-subtle rounded text-ink text-sm focus:outline-none focus:border-clay-soft"
                          >
                            <option value="word">{t('vocabulary.typeWord')}</option>
                            <option value="verb">{t('vocabulary.typeVerb')}</option>
                            <option value="idiom">{t('vocabulary.typeIdiom')}</option>
                            <option value="phrase">{t('vocabulary.typePhrase')}</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <textarea
                            value={row.definition}
                            onChange={(e) => updateRow(row.id, 'definition', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 bg-ink/5 border border-border-subtle rounded text-ink text-sm focus:outline-none focus:border-clay-soft resize-none"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <textarea
                            value={row.exampleSentence || ''}
                            onChange={(e) => updateRow(row.id, 'exampleSentence', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 bg-ink/5 border border-border-subtle rounded text-ink text-sm focus:outline-none focus:border-clay-soft resize-none"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={row.pronunciation || ''}
                            onChange={(e) => updateRow(row.id, 'pronunciation', e.target.value)}
                            className="w-full px-2 py-1 bg-ink/5 border border-border-subtle rounded text-ink text-sm focus:outline-none focus:border-clay-soft"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={row.categoryName || ''}
                            onChange={(e) => updateRow(row.id, 'categoryName', e.target.value || undefined)}
                            className="w-full px-2 py-1 bg-ink/5 border border-border-subtle rounded text-ink text-sm focus:outline-none focus:border-clay-soft"
                          >
                            <option value="">{t('vocabulary.noCategory')}</option>
                            {vocabularyCategories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                            <option value="__new__">{t('vocabulary.import.createNewCategory')}</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.status === 'new' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            row.status === 'duplicate' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                            'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {row.status === 'new' && t('vocabulary.import.newWordSingle')}
                            {row.status === 'duplicate' && t('vocabulary.import.duplicateSingle')}
                            {row.status === 'warning' && t('vocabulary.import.warningSingle')}
                          </span>
                          {row.warnings.length > 0 && (
                            <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {row.warnings.join('; ')}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button
                  onClick={() => setStep('input')}
                  className="px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors"
                >
                  {t('common.back')}
                </button>
                <button
                  onClick={handleImport}
                  disabled={selectedCount === 0}
                  className="px-6 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tWithCount('vocabulary.import.import', selectedCount)}
                </button>
              </div>
            </div>
          )}
          
          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 border-4 border-clay-soft/30 border-t-clay-soft rounded-full animate-spin" />
              <p className="text-ink">{tWithCount('vocabulary.import.importing', importProgress)}</p>
              <div className="w-full max-w-md bg-ink/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-clay-soft transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {step === 'done' && importResult && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check size={40} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-ink">{t('vocabulary.import.importDone')}</h3>
              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{importResult.inserted}</div>
                  <div className="text-sm text-ink-light">{t('vocabulary.import.inserted')}</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{importResult.updated}</div>
                  <div className="text-sm text-ink-light">{t('vocabulary.import.updated')}</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{importResult.skipped}</div>
                  <div className="text-sm text-ink-light">{t('vocabulary.import.skipped')}</div>
                </div>
              </div>
              {importResult.failed > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 w-full max-w-md">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{importResult.failed}</div>
                  <div className="text-sm text-ink-light">{t('vocabulary.import.failed')}</div>
                </div>
              )}
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
              >
                {t('common.close')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}