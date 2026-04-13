import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoverLetterStore } from '../../state/coverLetterStore.js';
import { Button } from '../../ui/Button.js';
import { Field } from '../../ui/Field.js';
import { RichTextField } from '../../ui/RichTextField.js';
import { SignaturePad } from '../../ui/SignaturePad.js';
import { Toggle } from '../../ui/Toggle.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { isValidImageFile, processSignatureFile } from '../../utils/imageUtils.js';

export function CoverLetterEditor() {
  const { t } = useTranslation();
  const cl = useCoverLetterStore((s) => s.coverLetter);
  const patchCoverLetter = useCoverLetterStore((s) => s.patchCoverLetter);
  const patchRecipient = useCoverLetterStore((s) => s.patchRecipient);
  const patchSender = useCoverLetterStore((s) => s.patchSender);
  const addParagraph = useCoverLetterStore((s) => s.addParagraph);
  const removeParagraph = useCoverLetterStore((s) => s.removeParagraph);
  const updateParagraph = useCoverLetterStore((s) => s.updateParagraph);
  const moveParagraph = useCoverLetterStore((s) => s.moveParagraph);
  const setDin5008Form = useCoverLetterStore((s) => s.setDin5008Form);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      alert(t('coverLetterEditor.signatureInvalidType'));
      return;
    }
    const dataUrl = await processSignatureFile(file);
    patchCoverLetter({ signatureImage: dataUrl });
  };

  const updateRecipientLocation = (patch: Record<string, string>) => {
    patchRecipient({ location: { ...cl.recipient.location, ...patch } });
  };

  const updateSenderLocation = (patch: Record<string, string>) => {
    patchSender({ location: { ...cl.sender.location, ...patch } });
  };

  const sender = cl.sender;

  return (
    <div className="flex flex-col gap-4">
      {/* ── DIN 5008 Settings ── */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          {t('coverLetterEditor.din5008Form')}
        </h3>
        <ToggleGroup
          options={[
            { value: 'B', label: t('coverLetterEditor.formB') },
            { value: 'A', label: t('coverLetterEditor.formA') },
          ]}
          value={cl.din5008Form}
          onChange={(v) => {
            setDin5008Form(v);
          }}
        />
        <Toggle
          checked={cl.showFoldMarks}
          onChange={(checked) => {
            patchCoverLetter({ showFoldMarks: checked });
          }}
          label={t('coverLetterEditor.showFoldMarks')}
        />
      </section>

      {/* ── Sender (postal address only) ── */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          {t('coverLetterEditor.senderTitle')}
        </h3>
        <Field
          label={t('coverLetterEditor.name')}
          value={sender.name}
          onChange={(e) => {
            patchSender({ name: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.company')}
          value={sender.company ?? ''}
          onChange={(e) => {
            patchSender({ company: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.address')}
          value={sender.location?.address ?? ''}
          onChange={(e) => {
            updateSenderLocation({ address: e.target.value });
          }}
        />
        <div className="grid grid-cols-3 gap-3">
          <Field
            label={t('coverLetterEditor.postalCode')}
            value={sender.location?.postalCode ?? ''}
            onChange={(e) => {
              updateSenderLocation({ postalCode: e.target.value });
            }}
          />
          <div className="col-span-2">
            <Field
              label={t('coverLetterEditor.city')}
              value={sender.location?.city ?? ''}
              onChange={(e) => {
                updateSenderLocation({ city: e.target.value });
              }}
            />
          </div>
        </div>
        <Field
          label={t('coverLetterEditor.country')}
          value={sender.location?.countryCode ?? ''}
          placeholder="DE"
          onChange={(e) => {
            updateSenderLocation({ countryCode: e.target.value });
          }}
        />
      </section>

      {/* ── Recipient ── */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          {t('coverLetterEditor.recipientTitle')}
        </h3>
        <Toggle
          checked={cl.showSenderInfo}
          onChange={(checked) => {
            patchCoverLetter({ showSenderInfo: checked });
          }}
          label={t('coverLetterEditor.showSenderInfo')}
        />
        <Field
          label={t('coverLetterEditor.company')}
          value={cl.recipient.company ?? ''}
          onChange={(e) => {
            patchRecipient({ company: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.name')}
          value={cl.recipient.name}
          onChange={(e) => {
            patchRecipient({ name: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.address')}
          value={cl.recipient.location?.address ?? ''}
          onChange={(e) => {
            updateRecipientLocation({ address: e.target.value });
          }}
        />
        <div className="grid grid-cols-3 gap-3">
          <Field
            label={t('coverLetterEditor.postalCode')}
            value={cl.recipient.location?.postalCode ?? ''}
            onChange={(e) => {
              updateRecipientLocation({ postalCode: e.target.value });
            }}
          />
          <div className="col-span-2">
            <Field
              label={t('coverLetterEditor.city')}
              value={cl.recipient.location?.city ?? ''}
              onChange={(e) => {
                updateRecipientLocation({ city: e.target.value });
              }}
            />
          </div>
        </div>
        <Field
          label={t('coverLetterEditor.country')}
          value={cl.recipient.location?.countryCode ?? ''}
          placeholder="DE"
          onChange={(e) => {
            updateRecipientLocation({ countryCode: e.target.value });
          }}
        />
      </section>

      {/* ── Letter Details ── */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          {t('coverLetterEditor.metaTitle')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label={t('coverLetterEditor.place')}
            value={cl.place ?? ''}
            onChange={(e) => {
              patchCoverLetter({ place: e.target.value });
            }}
          />
          <Field
            label={t('coverLetterEditor.date')}
            type="date"
            value={cl.date ?? ''}
            onChange={(e) => {
              patchCoverLetter({ date: e.target.value });
            }}
          />
        </div>
        <Field
          label={t('coverLetterEditor.subject')}
          value={cl.subject}
          onChange={(e) => {
            patchCoverLetter({ subject: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.reference')}
          value={cl.reference}
          placeholder={t('coverLetterEditor.referencePlaceholder')}
          onChange={(e) => {
            patchCoverLetter({ reference: e.target.value });
          }}
        />
      </section>

      {/* ── Body ── */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          {t('coverLetterEditor.bodyTitle')}
        </h3>
        <Field
          label={t('coverLetterEditor.salutation')}
          value={cl.salutation}
          placeholder={t('coverLetterEditor.salutationPlaceholder')}
          onChange={(e) => {
            patchCoverLetter({ salutation: e.target.value });
          }}
        />

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-slate-700">
            {t('coverLetterEditor.paragraphs')}
          </span>
          {cl.paragraphs.map((p, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => {
                    moveParagraph(i, i - 1);
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
                  disabled={i === cl.paragraphs.length - 1}
                  onClick={() => {
                    moveParagraph(i, i + 1);
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
                    removeParagraph(i);
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
                  updateParagraph(i, html);
                }}
              />
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addParagraph}>
            {t('coverLetterEditor.addParagraph')}
          </Button>
        </div>
      </section>

      {/* ── Closing & Signature ── */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          {t('coverLetterEditor.closingTitle')}
        </h3>
        <Field
          label={t('coverLetterEditor.closing')}
          value={cl.closing}
          placeholder={t('coverLetterEditor.closingPlaceholder')}
          onChange={(e) => {
            patchCoverLetter({ closing: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.signatureName')}
          value={cl.signatureName ?? ''}
          onChange={(e) => {
            patchCoverLetter({ signatureName: e.target.value });
          }}
        />

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-700">
            {t('coverLetterEditor.signatureImage')}
          </span>
          {cl.signatureImage ? (
            <div className="flex items-center gap-3">
              <img
                src={cl.signatureImage}
                alt=""
                className="h-10 rounded border border-slate-200"
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  patchCoverLetter({ signatureImage: undefined });
                }}
              >
                {t('coverLetterEditor.removeSignature')}
              </Button>
            </div>
          ) : (
            <SignatureInput
              onSave={(url) => {
                patchCoverLetter({ signatureImage: url });
              }}
              signatureInputRef={signatureInputRef}
              handleSignatureUpload={(e) => {
                void handleSignatureUpload(e);
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SignatureInput — toggle between upload and draw modes
// ---------------------------------------------------------------------------

function SignatureInput({
  onSave,
  signatureInputRef,
  handleSignatureUpload,
}: {
  onSave: (url: string) => void;
  signatureInputRef: React.RefObject<HTMLInputElement | null>;
  handleSignatureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'upload' | 'draw'>('draw');

  return (
    <div className="flex flex-col gap-2">
      <ToggleGroup
        options={[
          { value: 'draw', label: t('coverLetterEditor.signatureDrawMode') },
          { value: 'upload', label: t('coverLetterEditor.signatureUploadMode') },
        ]}
        value={mode}
        onChange={(v) => {
          setMode(v);
        }}
      />
      {mode === 'draw' ? (
        <SignaturePad onSave={onSave} />
      ) : (
        <>
          <input
            ref={signatureInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleSignatureUpload}
          />
          <Button variant="secondary" size="sm" onClick={() => signatureInputRef.current?.click()}>
            {t('coverLetterEditor.uploadSignature')}
          </Button>
        </>
      )}
    </div>
  );
}
