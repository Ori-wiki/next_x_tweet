import React from 'react';
import { Tweet } from './Tweet';
import { TWEETS } from '../../shared/data/tweets.data';
import { TweetForm } from './TweetForm';

export default function HomePage() {
  return (
    <div className='w-full'>
      <h1 className='mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl'>Home</h1>
      <TweetForm />
      <div className='space-y-5'>
        {TWEETS.map((tweet) => (
          <Tweet key={tweet.author} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}
