import type { DocumentType } from '@cv/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoverLetterVariantsStore } from '../../state/coverLetterVariantsStore.js';
import { useCvVariantsStore } from '../../state/cvVariantsStore.js';

interface VariantManagerModalProps {
  documentType: DocumentType;
  onClose: () => void;
}

/**
 * Modal listing all variants for the current document type with actions:
 * create, rename, duplicate, delete, select. The list is swapped depending
 * on whether we're managing CV variants or cover-letter variants.
 */
/**
 *
 * @param props
 */
export function VariantManagerModal({ documentType, onClose }: VariantManagerModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-16"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {t('variants.manageTitle', {
              defaultValue:
                documentType === 'anschreiben' ? 'Anschreiben-Varianten' : 'Lebenslauf-Varianten',
            })}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {documentType === 'anschreiben' ? <CoverLetterList /> : <CvList />}
      </div>
    </div>
  );
}

function CvList() {
  const { t } = useTranslation();
  const variants = useCvVariantsStore((s) => s.variants);
  const activeId = useCvVariantsStore((s) => s.activeVariantId);
  const setActive = useCvVariantsStore((s) => s.setActiveVariantId);
  const create = useCvVariantsStore((s) => s.createVariant);
  const duplicate = useCvVariantsStore((s) => s.duplicateVariant);
  const remove = useCvVariantsStore((s) => s.removeVariant);
  const setName = useCvVariantsStore((s) => s.setVariantName);

  const [newName, setNewName] = useState('');

  return (
    <>
      <div className="flex flex-col gap-1">
        {variants.map((v) => (
          <VariantRow
            key={v.id}
            id={v.id}
            name={v.name}
            subtitle={t('variants.cvSubtitle', {
              defaultValue: `${v.documentLocale.toUpperCase()} · ${v.paperSize}`,
              locale: v.documentLocale,
              size: v.paperSize,
            })}
            active={v.id === activeId}
            onSelect={() => {
              setActive(v.id);
            }}
            onRename={(n) => {
              setName(v.id, n);
            }}
            onDuplicate={() => {
              duplicate(
                v.id,
                t('variants.copyOf', { defaultValue: 'Kopie von {{name}}', name: v.name }),
              );
            }}
            onDelete={() => {
              remove(v.id);
            }}
            canDelete={variants.length > 1}
          />
        ))}
      </div>

      <CreateRow
        value={newName}
        onChange={setNewName}
        onCreate={() => {
          const name = newName.trim();
          if (!name) return;
          create(name);
          setNewName('');
        }}
      />
    </>
  );
}

function CoverLetterList() {
  const { t } = useTranslation();
  const variants = useCoverLetterVariantsStore((s) => s.variants);
  const activeId = useCoverLetterVariantsStore((s) => s.activeVariantId);
  const setActive = useCoverLetterVariantsStore((s) => s.setActiveVariantId);
  const create = useCoverLetterVariantsStore((s) => s.createVariant);
  const duplicate = useCoverLetterVariantsStore((s) => s.duplicateVariant);
  const remove = useCoverLetterVariantsStore((s) => s.removeVariant);
  const patch = useCoverLetterVariantsStore((s) => s.patchVariant);

  const [newName, setNewName] = useState('');

  return (
    <>
      <div className="flex flex-col gap-1">
        {variants.map((v) => (
          <VariantRow
            key={v.id}
            id={v.id}
            name={v.name}
            subtitle={v.recipient.company ?? v.recipient.name}
            active={v.id === activeId}
            onSelect={() => {
              setActive(v.id);
            }}
            onRename={(n) => {
              patch(v.id, { name: n });
            }}
            onDuplicate={() => {
              duplicate(
                v.id,
                t('variants.copyOf', { defaultValue: 'Kopie von {{name}}', name: v.name }),
              );
            }}
            onDelete={() => {
              remove(v.id);
            }}
            canDelete={variants.length > 1}
          />
        ))}
      </div>

      <CreateRow
        value={newName}
        onChange={setNewName}
        onCreate={() => {
          const name = newName.trim();
          if (!name) return;
          create(name);
          setNewName('');
        }}
      />
    </>
  );
}

interface VariantRowProps {
  id: string;
  name: string;
  subtitle?: string;
  active: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function VariantRow({
  name,
  subtitle,
  active,
  canDelete,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
}: VariantRowProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) onRename(trimmed);
    else setDraft(name);
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
        active ? 'border-slate-400 bg-slate-50' : 'border-slate-200 bg-white'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 flex-col items-start text-left"
        aria-pressed={active}
      >
        {editing ? (
          <input
            ref={(el) => el?.focus()}
            value={draft}
            onChange={(e) => { setDraft(e.target.value); }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') {
                setDraft(name);
                setEditing(false);
              }
            }}
            className="w-full rounded border border-slate-300 bg-white px-2 py-0.5 text-sm"
          />
        ) : (
          <span className="truncate text-sm font-medium text-slate-800">{name}</span>
        )}
        {subtitle && !editing && (
          <span className="truncate text-xs text-slate-500">{subtitle}</span>
        )}
      </button>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setDraft(name);
            setEditing((e) => !e);
          }}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          title={t('variants.rename', { defaultValue: 'Umbenennen' })}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M11 2l3 3-8 8H3v-3z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          title={t('variants.duplicate', { defaultValue: 'Duplizieren' })}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="4" y="4" width="9" height="9" rx="1.5" />
            <path d="M3 11V4a1 1 0 011-1h7" />
          </svg>
        </button>
        <button
          type="button"
          disabled={!canDelete}
          onClick={onDelete}
          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
          title={t('variants.delete', { defaultValue: 'Löschen' })}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M3 5h10M6 5V3h4v2M5 5l1 9h4l1-9" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function CreateRow({
  value,
  onChange,
  onCreate,
}: {
  value: string;
  onChange: (v: string) => void;
  onCreate: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 border-t border-slate-200 pt-3">
      <input
        value={value}
        placeholder={t('variants.newPlaceholder', { defaultValue: 'Neue Variante – Name' })}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onCreate();
        }}
        className="flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      />
      <button
        type="button"
        onClick={onCreate}
        disabled={value.trim().length === 0}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-40"
      >
        {t('variants.create', { defaultValue: '+ Variante' })}
      </button>
    </div>
  );
}
