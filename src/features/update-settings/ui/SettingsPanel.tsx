import { LANGUAGE_OPTIONS } from '@/src/entities/user/config/preferences';
import { getDictionary } from '@/src/shared/lib/i18n';
import { updateSettingsAction } from '@/src/features/update-settings/model/actions';
import type { UserSettings } from '@/src/entities/user/model/types';
import { SelectField } from '@/src/shared/ui/SelectField';
import { SubmitButton } from '@/src/shared/ui/SubmitButton';
import { SurfaceCard } from '@/src/shared/ui/SurfaceCard';

interface SettingsPanelProps {
  settings: UserSettings;
  hideEyebrow?: boolean;
}

export const SettingsPanel = ({
  settings,
  hideEyebrow = false,
}: SettingsPanelProps) => {
  const { common, settings: settingsText } = getDictionary(settings.language);
  const optionLabels = {
    en: settingsText.english,
    ru: settingsText.russian,
  } as const;

  return (
    <SurfaceCard className='space-y-4 p-5'>
      <div>
        {!hideEyebrow ? (
          <p className='text-sm uppercase tracking-[0.2em] text-[var(--color-text-subtle)]'>
            {settingsText.preferences}
          </p>
        ) : null}
        <h2 className='mt-2 text-xl font-semibold text-[var(--color-text-primary)]'>
          {settingsText.userSettings}
        </h2>
        <p className='mt-2 text-sm text-[var(--color-text-soft)]'>{settingsText.description}</p>
      </div>

      <form action={updateSettingsAction} className='grid gap-4'>
        <label className='space-y-2 text-sm text-[var(--color-text-secondary)]'>
          <span>{settingsText.language}</span>
          <SelectField
            name='language'
            defaultValue={settings.language}
            className='w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-dark-medium)] px-4 py-3 outline-none transition focus:border-[var(--color-accent)]'
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {optionLabels[option.value]}
              </option>
            ))}
          </SelectField>
        </label>
        <div>
          <SubmitButton
            idleLabel={common.saveSettings}
            pendingLabel={common.saving}
          />
        </div>
      </form>
    </SurfaceCard>
  );
};
