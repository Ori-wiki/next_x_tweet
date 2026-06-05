'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';
import { SelectField } from '@/src/shared/ui/SelectField';

type ExploreSearchFormTexts = {
  searchPlaceholder: string;
  tagPlaceholder: string;
  latestFirst: string;
  topTweets: string;
  search: string;
};

interface ExploreSearchFormProps {
  q?: string;
  tag?: string;
  sort: 'latest' | 'top';
  suggestions: string[];
  texts: ExploreSearchFormTexts;
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

function buildNextHistory(query: string, history: string[]) {
  return [query, ...history.filter((item) => item !== query)].slice(0, 5);
}

function persistSearchHistory(nextHistory: string[]) {
  window.localStorage.setItem(searchHistoryKey, JSON.stringify(nextHistory));
  window.dispatchEvent(new Event(searchHistoryEvent));
}

export const ExploreSearchForm = ({
  q,
  suggestions,
  tag,
  sort,
  texts,
}: ExploreSearchFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(q ?? '');
  const [history] = useState(() => readSearchHistory());
  const quickFilters = [...new Set([...history, ...suggestions])].slice(0, 6);
  const fieldClassName =
    'h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-dark-medium)] px-4 text-sm outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const normalized = query.trim();
    const normalizedTag = String(formData.get('tag') ?? '').trim().replace(/^#/, '');
    const selectedSort = String(formData.get('sort') ?? 'latest');
    const params = new URLSearchParams();

    if (normalized) {
      params.set('q', normalized);
      persistSearchHistory(buildNextHistory(normalized, readSearchHistory()));
    }

    if (normalizedTag) {
      params.set('tag', normalizedTag);
    }

    if (selectedSort === 'top') {
      params.set('sort', selectedSort);
    }

    const queryString = params.toString();
    startTransition(() => {
      router.push(queryString ? `/explore?${queryString}` : '/explore');
    });
  }

  return (
    <div className='mt-4 space-y-2'>
      <form
        className='grid gap-3 transition-opacity sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_170px_140px] sm:items-stretch data-[pending=true]:opacity-80'
        data-pending={isPending}
        onSubmit={handleSubmit}
      >
        <input
          name='q'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label={texts.searchPlaceholder}
          placeholder={texts.search}
          className={fieldClassName}
        />
        <input
          name='tag'
          defaultValue={tag}
          aria-label={texts.tagPlaceholder}
          placeholder='#tag'
          className={fieldClassName}
        />
        <SelectField
          name='sort'
          defaultValue={sort}
          className={fieldClassName}
        >
          <option value='latest'>{texts.latestFirst}</option>
          <option value='top'>{texts.topTweets}</option>
        </SelectField>
        <button
          type='submit'
          disabled={isPending}
          className='h-12 rounded-2xl bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:cursor-pointer hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-70'
        >
          {isPending ? 'Loading...' : texts.search}
        </button>
      </form>

      <div className='flex flex-wrap gap-2'>
        {quickFilters.map((item) => (
          <button
            key={item}
            type='button'
            onClick={() => setQuery(item)}
            className='rounded-full border border-[var(--color-border)] bg-[var(--color-surface-dark)] px-3 py-1 text-xs text-[var(--color-text-secondary)] transition hover:cursor-pointer hover:border-[var(--color-accent-border-hover)] hover:bg-[var(--color-accent-surface)] hover:text-[var(--color-text-primary)]'
          >
            {item}
          </button>
        ))}
        {(q || tag || sort === 'top') ? (
          <button
            type='button'
            onClick={() => {
              setQuery('');
              startTransition(() => router.push('/explore'));
            }}
            className='rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-accent-text)] transition hover:cursor-pointer hover:border-[var(--color-accent-border-hover)] hover:bg-[var(--color-accent-surface)]'
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
};
