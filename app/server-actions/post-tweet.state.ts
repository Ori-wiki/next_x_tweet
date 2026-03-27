export interface TweetActionState {
  status: 'idle' | 'success' | 'error';
  message: string;
  errors?: {
    content?: string[];
    mediaUrl?: string[];
    attachmentLabel?: string[];
  };
}

export const initialTweetActionState: TweetActionState = {
  status: 'idle',
  message: '',
};
