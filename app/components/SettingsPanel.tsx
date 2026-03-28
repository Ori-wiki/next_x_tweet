import { LANGUAGE_OPTIONS } from '@/app/config/preferences.config';
import { getDictionary } from '@/app/shared/lib/i18n';
import { updateSettingsAction } from '@/app/server-actions/post-tweet';
import type { UserSettings } from '@/app/shared/types/user.interface';
import { SubmitButton } from './SubmitButton';
import { SurfaceCard } from './SurfaceCard';

interface SettingsPanelProps {
  settings: UserSettings;
}

export const SettingsPanel = ({ settings }: SettingsPanelProps) => {
  const { common, settings: settingsText } = getDictionary(settings.language);
  const optionLabels = {
    en: settingsText.english,
    ru: settingsText.russian,
  } as const;

  return (
    <SurfaceCard className='space-y-4 p-5'>
      <div>
        <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
          {settingsText.preferences}
        </p>
        <h2 className='mt-2 text-xl font-semibold text-white'>
          {settingsText.userSettings}
        </h2>
        <p className='mt-2 text-sm text-white/60'>{settingsText.description}</p>
      </div>

      <form action={updateSettingsAction} className='grid gap-4'>
        <label className='space-y-2 text-sm text-white/70'>
          <span>{settingsText.language}</span>
          <select
            name='language'
            defaultValue={settings.language}
            className='w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-sky-400'
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {optionLabels[option.value]}
              </option>
            ))}
          </select>
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
