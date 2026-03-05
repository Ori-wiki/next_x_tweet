import { postTweet } from '@/app/server-actions/post-tweet';

export const TweetForm = () => {
  return (
    <form
      action={postTweet}
      className='mb-5 space-y-3 rounded-xl border border-white/10 p-4 text-white'
    >
      <input
        name='content'
        placeholder='What`s happening?'
        className='w-full bg-transparent text-sm outline-none placeholder-gray-500 sm:text-base'
      />
      <div className='flex justify-end'>
        <button
          className='rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-gray-200'
        >
          Tweet
        </button>
      </div>
    </form>
  );
};
