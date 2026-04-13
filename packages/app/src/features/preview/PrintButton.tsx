import { useTranslation } from 'react-i18next';
import { triggerPreviewPrint } from './previewController.js';

export function PrintButton() {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={triggerPreviewPrint}
      className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
    >
      {t('actions.exportPdf')}
    </button>
  );
}
