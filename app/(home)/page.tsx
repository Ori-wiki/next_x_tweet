import React from 'react';
import { Tweet } from './Tweet';
import { TWEETS } from '../shared/data/tweets.data';

export default function HomePage() {
  return (
    <div className='min-h-screen flex justify-center px-4 py-8'>
      <div className='w-full max-w-xl'>
        <h1 className='text-3xl font-bold mb-6 leading-none'>Home</h1>
        <div className='space-y-6'>
          {TWEETS.map((tweet) => (
            <Tweet key={tweet.author} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
}
