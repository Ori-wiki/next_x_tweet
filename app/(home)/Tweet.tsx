import { ITweet } from '../shared/types/tweet.interface';
import Image from 'next/image';

interface TweetProps {
  tweet: ITweet;
}

export const Tweet = ({ tweet }: TweetProps) => {
  return (
    <div className='border border-white/10 rounded-xl p-4 bg-black'>
      <div className='flex items-center gap-3 mb-2'>
        <Image src='/XTwitterW.svg' width={24} height={24} alt='X logo' />
        <span className='font-semibold'>@{tweet.author}</span>
      </div>

      <p className='text-white/90'>{tweet.text}</p>
    </div>
  );
};
