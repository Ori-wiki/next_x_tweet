import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '@/shared/ui/AppProviders';
import type { TweetActionState } from '../model/state';
import { TweetForm } from './TweetForm';

describe('TweetForm', () => {
  it('renders compose UI and updates character counter', () => {
    const fakeAction = async (
      previousState: TweetActionState,
      formData: FormData,
    ): Promise<TweetActionState> => ({
      status: previousState.status,
      message: String(formData.get('content') ?? ''),
    });

    render(
      <AppProviders>
        <TweetForm action={fakeAction} />
      </AppProviders>,
    );

    const textarea = screen.getByLabelText('New tweet');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    expect(screen.getByText('11/280')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        'What is happening? Add hashtags like #nextjs if you want.',
      ),
    ).toBeInTheDocument();
  });
});
