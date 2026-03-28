'use client';

import { useMemo, useState } from 'react';

interface ExploreSearchFormProps {
  q?: string;
  tag?: string;
  sort: 'latest' | 'top';
  suggestions: string[];
  texts: {
    searchPlaceholder: string;
    tagPlaceholder: string;
    latestFirst: string;
    topTweets: string;
    search: string;
  };
}

const searchHistoryKey = 'next-x-tweet-search-history';

export const ExploreSearchForm = ({
  q,
  tag,
  sort,
  suggestions,
  texts,
}: ExploreSearchFormProps) => {
  const [query, setQuery] = useState(q ?? '');
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(searchHistoryKey);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  });

  const mergedSuggestions = useMemo(() => {
    return [...new Set([query, ...history, ...suggestions])].filter(Boolean).slice(0, 8);
  }, [history, query, suggestions]);

  function handleSubmit() {
    const normalized = query.trim();

    if (!normalized) {
      return;
    }

    const nextHistory = [normalized, ...history.filter((item) => item !== normalized)].slice(
      0,
      5,
    );
    setHistory(nextHistory);
    window.localStorage.setItem(searchHistoryKey, JSON.stringify(nextHistory));
  }

  return (
    <form
      className='mt-4 grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_170px_auto]'
      onSubmit={handleSubmit}
    >
      <div className='space-y-2'>
        <input
          name='q'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          list='explore-suggestions'
          placeholder={texts.searchPlaceholder}
          className='w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400'
        />
        <datalist id='explore-suggestions'>
          {mergedSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
        {history.length > 0 ? (
          <div className='flex flex-wrap gap-2'>
            {history.map((item) => (
              <button
                key={item}
                type='button'
                onClick={() => setQuery(item)}
                className='rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/65 transition hover:border-sky-300/35 hover:text-white'
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <input
        name='tag'
        defaultValue={tag}
        placeholder={texts.tagPlaceholder}
        className='rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400'
      />
      <select
        name='sort'
        defaultValue={sort}
        className='rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-sky-400'
      >
        <option value='latest'>{texts.latestFirst}</option>
        <option value='top'>{texts.topTweets}</option>
      </select>
      <button
        type='submit'
        className='rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-black transition hover:cursor-pointer hover:bg-sky-300'
      >
        {texts.search}
      </button>
    </form>
  );
};
