'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';

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
const searchHistoryEvent = 'next-x-tweet-search-history-change';
const EMPTY_HISTORY: string[] = [];

let cachedRawHistory: string | null = null;
let cachedParsedHistory: string[] = EMPTY_HISTORY;

function readSearchHistory() {
  if (typeof window === 'undefined') {
    return EMPTY_HISTORY;
  }

  const raw = window.localStorage.getItem(searchHistoryKey);

  if (!raw) {
    cachedRawHistory = null;
    cachedParsedHistory = EMPTY_HISTORY;
    return cachedParsedHistory;
  }

  if (raw === cachedRawHistory) {
    return cachedParsedHistory;
  }

  try {
    cachedRawHistory = raw;
    cachedParsedHistory = JSON.parse(raw) as string[];
    return cachedParsedHistory;
  } catch {
    cachedRawHistory = raw;
    cachedParsedHistory = EMPTY_HISTORY;
    return cachedParsedHistory;
  }
}

function subscribeToSearchHistory(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleChange = () => callback();

  window.addEventListener('storage', handleChange);
  window.addEventListener(searchHistoryEvent, handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(searchHistoryEvent, handleChange);
  };
}

export const ExploreSearchForm = ({
  q,
  tag,
  sort,
  suggestions,
  texts,
}: ExploreSearchFormProps) => {
  const [query, setQuery] = useState(q ?? '');
  const history = useSyncExternalStore(
    subscribeToSearchHistory,
    readSearchHistory,
    () => EMPTY_HISTORY,
  );

  const mergedSuggestions = useMemo(() => {
    return [...new Set([query, ...history, ...suggestions])].filter(Boolean).slice(0, 8);
  }, [history, query, suggestions]);
  const fieldClassName =
    'h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400';

  function handleSubmit() {
    const normalized = query.trim();

    if (!normalized) {
      return;
    }

    const nextHistory = [normalized, ...history.filter((item) => item !== normalized)].slice(
      0,
      5,
    );
    window.localStorage.setItem(searchHistoryKey, JSON.stringify(nextHistory));
    window.dispatchEvent(new Event(searchHistoryEvent));
  }

  return (
    <div className='mt-4 space-y-2'>
      <form
        className='grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_170px_140px] sm:items-stretch'
        onSubmit={handleSubmit}
      >
        <input
          name='q'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          list='explore-suggestions'
          placeholder={texts.searchPlaceholder}
          className={fieldClassName}
        />
        <input
          name='tag'
          defaultValue={tag}
          placeholder={texts.tagPlaceholder}
          className={fieldClassName}
        />
        <select
          name='sort'
          defaultValue={sort}
          className={fieldClassName}
        >
          <option value='latest'>{texts.latestFirst}</option>
          <option value='top'>{texts.topTweets}</option>
        </select>
        <button
          type='submit'
          className='h-12 rounded-2xl bg-sky-400 px-5 text-sm font-semibold text-black transition hover:cursor-pointer hover:bg-sky-300'
        >
          {texts.search}
        </button>
      </form>

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
  );
};
