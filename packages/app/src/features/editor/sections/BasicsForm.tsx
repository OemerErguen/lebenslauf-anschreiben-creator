import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NATIONALITIES } from '../../../data/nationalities.js';
import { useResumeStore } from '../../../state/resumeStore.js';
import { useSettingsStore } from '../../../state/settingsStore.js';
import { Field } from '../../../ui/Field.js';
import { LocationFields } from '../../../ui/LocationFields.js';
import { isValidImageFile, processPhotoFile } from '../../../utils/imageUtils.js';

export function BasicsForm() {
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentLocale = useSettingsStore((s) => s.settings.documentLocale);

  const basics = resume.basics;
  const update = (patch: Partial<typeof basics>) => {
    setResume({ ...resume, basics: { ...basics, ...patch } });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      alert(t('basics.imageInvalidType'));
      return;
    }
    const dataUrl = await processPhotoFile(file);
    update({ image: dataUrl });
  };

  const hasImage = !!basics.image;
  const isDataUrl = basics.image?.startsWith('data:');

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{t('basics.title')}</h3>

      {/* Row 1: Name + Job Title */}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label={t('basics.name')}
          value={basics.name}
          onChange={(e) => {
            update({ name: e.target.value });
          }}
        />
        <Field
          label={t('basics.label')}
          value={basics.label ?? ''}
          onChange={(e) => {
            update({ label: e.target.value });
          }}
        />
      </div>

      {/* Row 2: Photo upload */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">{t('basics.image')}</span>
        <div className="flex items-start gap-3">
          {hasImage && (
            <img
              src={basics.image}
              alt={basics.name}
              className="h-16 w-16 shrink-0 rounded-md border border-slate-200 object-cover"
            />
          )}
          <div className="flex flex-1 flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                void handleFileUpload(e);
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
              {t('basics.imageUpload')}
            </button>
            {!isDataUrl && (
              <input
                type="url"
                placeholder={t('basics.imageUrlPlaceholder')}
                value={basics.image ?? ''}
                onChange={(e) => {
                  update({ image: e.target.value });
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            )}
            {hasImage && (
              <button
                type="button"
                onClick={() => {
                  update({ image: '' });
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="self-start text-xs text-red-500 hover:text-red-700"
              >
                {t('basics.imageRemove')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Email + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label={t('basics.email')}
          type="email"
          value={basics.email ?? ''}
          onChange={(e) => {
            update({ email: e.target.value });
          }}
        />
        <Field
          label={t('basics.phone')}
          value={basics.phone ?? ''}
          onChange={(e) => {
            update({ phone: e.target.value });
          }}
        />
      </div>

      {/* Row 4: Website */}
      <Field
        label={t('basics.url')}
        type="url"
        value={basics.url ?? ''}
        onChange={(e) => {
          update({ url: e.target.value });
        }}
      />

      {/* Row 5: Address */}
      <LocationFields
        location={basics.location}
        onChange={(location) => {
          update({ location });
        }}
      />

      {/* Row 5: Birth Date + Birth Place + Nationality */}
      <div className="grid grid-cols-3 gap-3">
        <Field
          label={t('basics.birthDate')}
          placeholder="YYYY-MM-DD"
          value={basics.birthDate ?? ''}
          onChange={(e) => {
            update({ birthDate: e.target.value });
          }}
        />
        <Field
          label={t('basics.birthPlace')}
          value={basics.birthPlace ?? ''}
          onChange={(e) => {
            update({ birthPlace: e.target.value });
          }}
        />
        <label htmlFor="field-nationality" className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">{t('basics.nationality')}</span>
          <select
            id="field-nationality"
            value={basics.nationality ?? ''}
            onChange={(e) => {
              update({ nationality: e.target.value });
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="" />
            {NATIONALITIES.map((n) => {
              const value = n[documentLocale];
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </label>
      </div>
    </section>
  );
}
