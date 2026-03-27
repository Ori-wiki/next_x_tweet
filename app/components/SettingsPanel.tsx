import {
  DENSITY_OPTIONS,
  LANGUAGE_OPTIONS,
  THEME_OPTIONS,
} from '@/app/config/preferences.config';
import { updateSettingsAction } from '@/app/server-actions/post-tweet';
import type { UserSettings } from '@/app/shared/types/user.interface';
import { SubmitButton } from './SubmitButton';
import { SurfaceCard } from './SurfaceCard';

interface SettingsPanelProps {
  settings: UserSettings;
}

export const SettingsPanel = ({ settings }: SettingsPanelProps) => {
  const sections = [
    { label: 'Theme', name: 'theme', options: THEME_OPTIONS, value: settings.theme },
    {
      label: 'Density',
      name: 'density',
      options: DENSITY_OPTIONS,
      value: settings.density,
    },
    {
      label: 'Language',
      name: 'language',
      options: LANGUAGE_OPTIONS,
      value: settings.language,
    },
  ] as const;

  return (
    <SurfaceCard className='space-y-4 p-5'>
      <div>
        <p className='text-sm uppercase tracking-[0.2em] text-white/45'>Preferences</p>
        <h2 className='mt-2 text-xl font-semibold text-white'>User settings</h2>
        <p className='mt-2 text-sm text-white/60'>
          Switch theme, density and interface language for the current demo account.
        </p>
      </div>

      <form action={updateSettingsAction} className='grid gap-4 md:grid-cols-3'>
        {sections.map((section) => (
          <label key={section.name} className='space-y-2 text-sm text-white/70'>
            <span>{section.label}</span>
            <select
              name={section.name}
              defaultValue={section.value}
              className='w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-sky-400'
            >
              {section.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <div className='md:col-span-3'>
          <SubmitButton idleLabel='Save settings' pendingLabel='Saving...' />
        </div>
      </form>
    </SurfaceCard>
  );
};
