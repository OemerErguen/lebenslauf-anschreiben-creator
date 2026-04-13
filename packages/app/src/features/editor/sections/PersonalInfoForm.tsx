import type { SlotFormProps } from '../formRegistry.js';
import { useTranslation } from 'react-i18next';
import { NATIONALITIES } from '../../../data/nationalities.js';
import { useResumeStore } from '../../../state/resumeStore.js';
import { useSettingsStore } from '../../../state/settingsStore.js';
import { Field } from '../../../ui/Field.js';

export function PersonalInfoForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);

  const documentLocale = useSettingsStore((s) => s.settings.documentLocale);

  const basics = resume.basics;
  const update = (patch: Partial<typeof basics>) => {
    setResume({ ...resume, basics: { ...basics, ...patch } });
  };

  return (
    <div className="flex flex-col gap-3">
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
        <label htmlFor="field-nationality-pi" className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">{t('basics.nationality')}</span>
          <select
            id="field-nationality-pi"
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
    </div>
  );
}
