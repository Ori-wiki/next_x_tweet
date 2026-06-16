'use client';

import { UserRoundPen } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import type { UserLanguage, UserRecord } from '@/entities/user';
import { getDictionary } from '@/shared/lib/i18n';
import { useToast } from '@/shared/ui/AppProviders';
import { SubmitButton } from '@/shared/ui/SubmitButton';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { updateProfileAction } from '../model/actions';
import { initialProfileActionState } from '../model/state';

interface ProfileEditFormProps {
  language?: UserLanguage;
  profile: Pick<UserRecord, 'name' | 'bio' | 'avatar'>;
}

export const ProfileEditForm = ({
  language,
  profile,
}: ProfileEditFormProps) => {
  const [state, formAction] = useActionState(
    updateProfileAction,
    initialProfileActionState,
  );
  const { common, profile: profileText } = getDictionary(language);
  const { showToast } = useToast();

  useEffect(() => {
    if (state.status === 'success') {
      showToast(state.message);
    }
  }, [showToast, state.message, state.status]);

  return (
    <SurfaceCard className='space-y-4 p-5'>
      <div>
        <p className='text-sm uppercase tracking-[0.2em] text-(--color-text-subtle)'>
          {profileText.editProfileEyebrow}
        </p>
        <h2 className='mt-2 flex items-center gap-2 text-xl font-semibold text-(--color-text-primary)'>
          <UserRoundPen aria-hidden='true' size={19} />
          {profileText.editProfile}
        </h2>
        <p className='mt-2 text-sm text-(--color-text-soft)'>
          {profileText.editProfileDescription}
        </p>
      </div>

      <form action={formAction} className='grid gap-4'>
        <label className='space-y-2 text-sm text-(--color-text-secondary)'>
          <span>{profileText.displayName}</span>
          <input
            name='name'
            defaultValue={profile.name}
            className='w-full rounded-2xl border border-(--color-border) bg-(--color-surface-dark-medium) px-4 py-3 text-(--color-text-primary) outline-none transition placeholder:text-(--color-text-faint) focus:border-(--color-accent)'
          />
          {state.errors?.name?.map((error) => (
            <span key={error} className='block text-xs text-(--color-danger)'>
              {error}
            </span>
          ))}
        </label>

        <label className='space-y-2 text-sm text-(--color-text-secondary)'>
          <span>{profileText.bio}</span>
          <textarea
            name='bio'
            defaultValue={profile.bio}
            rows={4}
            className='w-full resize-none rounded-2xl border border-(--color-border) bg-(--color-surface-dark-medium) px-4 py-3 text-(--color-text-primary) outline-none transition placeholder:text-(--color-text-faint) focus:border-(--color-accent)'
          />
          {state.errors?.bio?.map((error) => (
            <span key={error} className='block text-xs text-(--color-danger)'>
              {error}
            </span>
          ))}
        </label>

        <label className='space-y-2 text-sm text-(--color-text-secondary)'>
          <span>{profileText.avatarUrl}</span>
          <input
            name='avatar'
            defaultValue={profile.avatar}
            className='w-full rounded-2xl border border-(--color-border) bg-(--color-surface-dark-medium) px-4 py-3 text-(--color-text-primary) outline-none transition placeholder:text-(--color-text-faint) focus:border-(--color-accent)'
          />
          {state.errors?.avatar?.map((error) => (
            <span key={error} className='block text-xs text-(--color-danger)'>
              {error}
            </span>
          ))}
        </label>

        {state.status === 'error' && state.message ? (
          <p className='text-sm text-(--color-danger)'>{state.message}</p>
        ) : null}

        <div>
          <SubmitButton
            idleLabel={profileText.saveProfile}
            pendingLabel={common.saving}
          />
        </div>
      </form>
    </SurfaceCard>
  );
};
