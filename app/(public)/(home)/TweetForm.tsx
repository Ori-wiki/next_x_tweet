import { postTweet } from '@/app/server-actions/post-tweet';

export const TweetForm = () => {
  return (
    <form
      action={postTweet}
      className='border border-white/10 rounded-xl p-4
     text-white space-y-3 mb-5'
    >
      <input
        name='content'
        placeholder='What`s happening?'
        className='w-full bg-transparent outline-none
         placeholder-gray-500'
      />
      <div className='flex justify-end'>
        <button
          className='bg-white text-black text-sm font-semibold
           px-4 py-1.5 rounded-full hover:bg-gray-200 transition'
        >
          Tweet
        </button>
      </div>
    </form>
  );
};
