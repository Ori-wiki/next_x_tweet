import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TweetActionState } from '@/app/server-actions/post-tweet.state';
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

    render(<TweetForm action={fakeAction} />);

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
