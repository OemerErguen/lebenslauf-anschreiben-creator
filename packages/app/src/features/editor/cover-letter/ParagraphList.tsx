import { useTranslation } from 'react-i18next';
import {
  useActiveCoverLetterVariant,
  useCoverLetterVariantsStore,
} from '../../../state/coverLetterVariantsStore.js';
import { Button } from '../../../ui/Button.js';
import { RichTextField } from '../../../ui/RichTextField.js';

export function ParagraphList() {
  const { t } = useTranslation();
  const variant = useActiveCoverLetterVariant();
  const addParagraph = useCoverLetterVariantsStore((s) => s.addParagraph);
  const removeParagraph = useCoverLetterVariantsStore((s) => s.removeParagraph);
  const updateParagraph = useCoverLetterVariantsStore((s) => s.updateParagraph);
  const moveParagraph = useCoverLetterVariantsStore((s) => s.moveParagraph);

  if (!variant) return null;

  const paragraphs = variant.paragraphs;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-slate-700">
        {t('coverLetterEditor.paragraphs')}
      </span>
      {paragraphs.map((p, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => {
                moveParagraph(variant.id, i, i - 1);
              }}
              className="rounded p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
              title={t('designer.moveUp')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 8.5l4-4 4 4" />
              </svg>
            </button>
            <button
              type="button"
              disabled={i === paragraphs.length - 1}
              onClick={() => {
                moveParagraph(variant.id, i, i + 1);
              }}
              className="rounded p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
              title={t('designer.moveDown')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 5.5l4 4 4-4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                removeParagraph(variant.id, i);
              }}
              className="rounded p-0.5 text-slate-400 hover:text-red-500"
              title={t('coverLetterEditor.removeParagraph')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </button>
          </div>
          <RichTextField
            label={`${i + 1}.`}
            value={p}
            onChange={(html) => {
              updateParagraph(variant.id, i, html);
            }}
          />
        </div>
      ))}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          addParagraph(variant.id);
        }}
      >
        {t('coverLetterEditor.addParagraph')}
      </Button>
    </div>
  );
}
