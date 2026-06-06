import { LANGUAGE_OPTIONS } from '@/shared/config/language';
import { getDictionary } from '@/shared/lib/i18n';
import { updateSettingsAction } from '../model/actions';
import type { UserSettings } from '@/entities/user';
import { SelectField } from '@/shared/ui/SelectField';
import { SubmitButton } from '@/shared/ui/SubmitButton';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';

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
          <p className='text-sm uppercase tracking-[0.2em] text-(--color-text-subtle)'>
            {settingsText.preferences}
          </p>
        ) : null}
        <h2 className='mt-2 text-xl font-semibold text-(--color-text-primary)'>
          {settingsText.userSettings}
        </h2>
        <p className='mt-2 text-sm text-(--color-text-soft)'>{settingsText.description}</p>
      </div>

      <form action={updateSettingsAction} className='grid gap-4'>
        <label className='space-y-2 text-sm text-(--color-text-secondary)'>
          <span>{settingsText.language}</span>
          <SelectField
            name='language'
            defaultValue={settings.language}
            className='w-full rounded-2xl border border-(--color-border) bg-(--color-surface-dark-medium) px-4 py-3 outline-none transition focus:border-(--color-accent)'
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
