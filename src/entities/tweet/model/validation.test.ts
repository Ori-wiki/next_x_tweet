import { describe, expect, it } from 'vitest';
import { extractHashtags, tweetSchema } from './validation';

describe('tweetSchema', () => {
  it('accepts a valid tweet', () => {
    const result = tweetSchema.safeParse({
      content: 'Shipping a cleaner feed today. #nextjs',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an empty tweet', () => {
    const result = tweetSchema.safeParse({
      content: '   ',
    });

    expect(result.success).toBe(false);
  });
});

describe('extractHashtags', () => {
  it('extracts normalized hashtags from content', () => {
    expect(extractHashtags('Hello #NextJS and #TypeScript')).toEqual([
      'nextjs',
      'typescript',
    ]);
  });
});
