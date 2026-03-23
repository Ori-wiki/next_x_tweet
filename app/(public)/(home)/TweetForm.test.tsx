import { fireEvent, render, screen } from '@testing-library/react';
import { TweetForm } from './TweetForm';
import type { TweetActionState } from '@/app/server-actions/post-tweet.state';

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

    const textarea = screen.getByLabelText('Новый твит');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    expect(screen.getByText('11/280')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        'Что нового? Можно добавить и хэштеги, например #nextjs',
      ),
    ).toBeInTheDocument();
  });
});
