export interface TweetActionState {
  status: 'idle' | 'success' | 'error';
  message: string;
  errors?: {
    content?: string[];
  };
}

export const initialTweetActionState: TweetActionState = {
  status: 'idle',
  message: '',
};
