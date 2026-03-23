import { Tweet } from './Tweet';
import { TweetForm } from './TweetForm';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getTimeline } from '@/app/shared/lib/tweets';

export default async function HomePage() {
  const currentUser = await getSessionUser();
  const tweets = await getTimeline(currentUser);

  return (
    <div className='w-full'>
      <div className='mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_45%),rgba(255,255,255,0.03)] p-5'>
        <p className='text-sm uppercase tracking-[0.2em] text-sky-200/80'>
          Домашняя лента
        </p>
        <h1 className='text-2xl font-bold text-white sm:text-3xl'>
          Мини-клон X с живыми действиями, профилями и демо-сессией
        </h1>
        <p className='max-w-2xl text-white/70'>
          Лента теперь хранится в локальном JSON, умеет публиковать твиты, ставить
          лайки, сохранять записи и отражать изменения между страницами.
        </p>
      </div>

      {currentUser ? (
        <TweetForm />
      ) : (
        <div className='mb-6 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100'>
          Для публикации твитов и действий с лентой войди в один из демо-аккаунтов в
          шапке сайта.
        </div>
      )}

      <div className='space-y-5'>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} canInteract={Boolean(currentUser)} />
        ))}
      </div>
    </div>
  );
}
