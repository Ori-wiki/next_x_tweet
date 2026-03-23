import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDashboardData } from '@/app/shared/lib/tweets';
import { Tweet } from '../(home)/Tweet';

export const ProfileFake = async () => {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return null;
  }

  const dashboard = await getDashboardData(currentUser);

  return (
    <div className='space-y-6'>
      <section className='rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),rgba(255,255,255,0.03)] p-6'>
        <p className='text-sm uppercase tracking-[0.2em] text-amber-200/80'>
          Private route
        </p>
        <h1 className='mt-2 text-3xl font-bold text-white'>
          Ваш демо-профиль защищен middleware
        </h1>
        <p className='mt-3 max-w-2xl text-white/70'>
          Здесь собраны быстрые показатели аккаунта, избранные твиты и сохраненные
          записи. Если выйти из сессии, маршрут снова станет приватным.
        </p>
        <div className='mt-5 flex flex-wrap gap-3'>
          <Link
            href={PAGES.PROFILE(currentUser.username)}
            className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-100'
          >
            Открыть публичный профиль
          </Link>
          <Link
            href={PAGES.EXPLORE}
            className='rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15'
          >
            Открыть explore
          </Link>
        </div>
      </section>

      <section className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-3xl border border-white/10 bg-white/[0.03] p-5'>
          <p className='text-sm text-white/50'>User</p>
          <p className='mt-1 text-xl font-semibold text-white'>{currentUser.name}</p>
          <p className='text-sky-200'>@{currentUser.username}</p>
        </div>
        <div className='rounded-3xl border border-white/10 bg-white/[0.03] p-5'>
          <p className='text-sm text-white/50'>Liked tweets</p>
          <p className='mt-1 text-3xl font-semibold text-white'>
            {dashboard.likedTweets.length}
          </p>
        </div>
        <div className='rounded-3xl border border-white/10 bg-white/[0.03] p-5'>
          <p className='text-sm text-white/50'>Bookmarks</p>
          <p className='mt-1 text-3xl font-semibold text-white'>
            {dashboard.bookmarkedTweets.length}
          </p>
        </div>
      </section>

      <section className='space-y-5'>
        <h2 className='text-xl font-semibold text-white'>Saved tweets</h2>
        {dashboard.bookmarkedTweets.length > 0 ? (
          dashboard.bookmarkedTweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} canInteract />
          ))
        ) : (
          <div className='rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-white/65'>
            Пока нет сохраненных твитов.
          </div>
        )}
      </section>
    </div>
  );
};
