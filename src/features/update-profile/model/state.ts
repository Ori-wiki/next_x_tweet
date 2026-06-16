export interface ProfileActionState {
  status: 'idle' | 'success' | 'error';
  message: string;
  errors?: {
    name?: string[];
    bio?: string[];
    avatar?: string[];
  };
}

export const initialProfileActionState: ProfileActionState = {
  status: 'idle',
  message: '',
};
