import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoverLetterProfileStore } from '../../state/coverLetterProfileStore.js';
import {
  useActiveCoverLetterVariant,
  useCoverLetterVariantsStore,
} from '../../state/coverLetterVariantsStore.js';
import { Button } from '../../ui/Button.js';
import { Field } from '../../ui/Field.js';
import { SignaturePad } from '../../ui/SignaturePad.js';
import { Toggle } from '../../ui/Toggle.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { isValidImageFile, processSignatureFile } from '../../utils/imageUtils.js';
import { LetterSection } from './cover-letter/LetterSection.js';
import { ParagraphList } from './cover-letter/ParagraphList.js';

/**
 * Editor for a single cover letter. Profile-level fields (sender, signature,
 * defaults) always edit the shared cover-letter profile pool; per-letter
 * fields (recipient, subject, paragraphs) edit the active variant.
 */
export function CoverLetterEditor() {
  const { t } = useTranslation();

  // Profile pool (shared across all letters)
  const profile = useCoverLetterProfileStore((s) => s.profile);
  const patchProfile = useCoverLetterProfileStore((s) => s.patchProfile);
  const patchSender = useCoverLetterProfileStore((s) => s.patchSender);

  // Active variant (per-letter data)
  const variant = useActiveCoverLetterVariant();
  const patchVariant = useCoverLetterVariantsStore((s) => s.patchVariant);
  const patchRecipient = useCoverLetterVariantsStore((s) => s.patchRecipient);

  const signatureInputRef = useRef<HTMLInputElement>(null);

  if (!variant) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        {t('coverLetterEditor.noVariant', {
          defaultValue:
            'No cover letter variant selected. Create one from the variant manager to start writing.',
        })}
      </div>
    );
  }

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      alert(t('coverLetterEditor.signatureInvalidType'));
      return;
    }
    const dataUrl = await processSignatureFile(file);
    patchProfile({ signatureImage: dataUrl });
  };

  const updateRecipientLocation = (patch: Record<string, string>) => {
    patchRecipient(variant.id, {
      location: { ...variant.recipient.location, ...patch },
    });
  };

  const updateSenderLocation = (patch: Record<string, string>) => {
    patchSender({ location: { ...profile.sender.location, ...patch } });
  };

  const sender = profile.sender;
  const din5008Form = variant.din5008Form ?? profile.defaultDin5008Form;
  const showFoldMarks = variant.showFoldMarks ?? profile.defaultShowFoldMarks;
  const showSenderInfo = variant.showSenderInfo ?? profile.defaultShowSenderInfo;
  const closing = variant.closingOverride ?? profile.defaultClosing;
  const signatureName = variant.signatureNameOverride ?? profile.signatureName;
  const signatureImage = variant.signatureImageOverride ?? profile.signatureImage;

  return (
    <div className="flex flex-col gap-4">
      {/* DIN 5008 Settings — per-letter override on top of profile defaults */}
      <LetterSection title={t('coverLetterEditor.din5008Form')}>
        <ToggleGroup
          options={[
            { value: 'B', label: t('coverLetterEditor.formB') },
            { value: 'A', label: t('coverLetterEditor.formA') },
          ]}
          value={din5008Form}
          onChange={(v) => {
            patchVariant(variant.id, { din5008Form: v });
          }}
        />
        <Toggle
          checked={showFoldMarks}
          onChange={(checked) => {
            patchVariant(variant.id, { showFoldMarks: checked });
          }}
          label={t('coverLetterEditor.showFoldMarks')}
        />
      </LetterSection>

      {/* Sender — lives in the profile pool, same across all letters */}
      <LetterSection title={t('coverLetterEditor.senderTitle')}>
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field
            label={t('coverLetterEditor.postalCode')}
            value={sender.location?.postalCode ?? ''}
            onChange={(e) => {
              updateSenderLocation({ postalCode: e.target.value });
            }}
          />
          <div className="sm:col-span-2">
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
      </LetterSection>

      {/* Recipient — per-letter */}
      <LetterSection title={t('coverLetterEditor.recipientTitle')}>
        <Toggle
          checked={showSenderInfo}
          onChange={(checked) => {
            patchVariant(variant.id, { showSenderInfo: checked });
          }}
          label={t('coverLetterEditor.showSenderInfo')}
        />
        <Field
          label={t('coverLetterEditor.company')}
          value={variant.recipient.company ?? ''}
          onChange={(e) => {
            patchRecipient(variant.id, { company: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.name')}
          value={variant.recipient.name}
          onChange={(e) => {
            patchRecipient(variant.id, { name: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.address')}
          value={variant.recipient.location?.address ?? ''}
          onChange={(e) => {
            updateRecipientLocation({ address: e.target.value });
          }}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field
            label={t('coverLetterEditor.postalCode')}
            value={variant.recipient.location?.postalCode ?? ''}
            onChange={(e) => {
              updateRecipientLocation({ postalCode: e.target.value });
            }}
          />
          <div className="sm:col-span-2">
            <Field
              label={t('coverLetterEditor.city')}
              value={variant.recipient.location?.city ?? ''}
              onChange={(e) => {
                updateRecipientLocation({ city: e.target.value });
              }}
            />
          </div>
        </div>
        <Field
          label={t('coverLetterEditor.country')}
          value={variant.recipient.location?.countryCode ?? ''}
          placeholder="DE"
          onChange={(e) => {
            updateRecipientLocation({ countryCode: e.target.value });
          }}
        />
      </LetterSection>

      {/* Letter details — per-letter */}
      <LetterSection title={t('coverLetterEditor.metaTitle')}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label={t('coverLetterEditor.place')}
            value={variant.place ?? ''}
            onChange={(e) => {
              patchVariant(variant.id, { place: e.target.value });
            }}
          />
          <Field
            label={t('coverLetterEditor.date')}
            type="date"
            value={variant.date ?? ''}
            onChange={(e) => {
              patchVariant(variant.id, { date: e.target.value });
            }}
          />
        </div>
        <Field
          label={t('coverLetterEditor.subject')}
          value={variant.subject}
          onChange={(e) => {
            patchVariant(variant.id, { subject: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.reference')}
          value={variant.reference}
          placeholder={t('coverLetterEditor.referencePlaceholder')}
          onChange={(e) => {
            patchVariant(variant.id, { reference: e.target.value });
          }}
        />
      </LetterSection>

      {/* Body — per-letter */}
      <LetterSection title={t('coverLetterEditor.bodyTitle')}>
        <Field
          label={t('coverLetterEditor.salutation')}
          value={variant.salutation}
          placeholder={t('coverLetterEditor.salutationPlaceholder')}
          onChange={(e) => {
            patchVariant(variant.id, { salutation: e.target.value });
          }}
        />
        <ParagraphList />
      </LetterSection>

      {/* Closing & signature — defaults from profile, overridable per-letter */}
      <LetterSection title={t('coverLetterEditor.closingTitle')}>
        <Field
          label={t('coverLetterEditor.closing')}
          value={closing}
          placeholder={t('coverLetterEditor.closingPlaceholder')}
          onChange={(e) => {
            patchVariant(variant.id, { closingOverride: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.signatureName')}
          value={signatureName}
          onChange={(e) => {
            patchProfile({ signatureName: e.target.value });
          }}
        />

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-700">
            {t('coverLetterEditor.signatureImage')}
          </span>
          {signatureImage ? (
            <div className="flex items-center gap-3">
              <img
                src={signatureImage}
                alt=""
                className="h-10 rounded border border-slate-200"
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  patchProfile({ signatureImage: '' });
                }}
              >
                {t('coverLetterEditor.removeSignature')}
              </Button>
            </div>
          ) : (
            <SignatureInput
              onSave={(url) => {
                patchProfile({ signatureImage: url });
              }}
              signatureInputRef={signatureInputRef}
              handleSignatureUpload={(e) => {
                void handleSignatureUpload(e);
              }}
            />
          )}
        </div>
      </LetterSection>
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
