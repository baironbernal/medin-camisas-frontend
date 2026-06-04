import { getHomeAds } from '@/app/services/homeAds';

export default async function HomeAdsTicker() {
  const ads = await getHomeAds();

  if (!ads || ads.length === 0) return null;

  // Repeat enough times so each half definitely overflows the widest screen (1920px).
  // Assumes ~400px per message on average; 6 per half guarantees >2400px coverage.
  const repeatCount = Math.max(1, Math.ceil(6 / ads.length));
  const half = Array.from({ length: repeatCount }, () => ads).flat();
  // Duplicate the half: animation moves -50% → seamless loop (second half = first half)
  const items = [...half, ...half];

  const duration = Math.max(15, half.length * 4);

  return (
    <div
      className="w-full overflow-hidden py-2.5 bg-accent"
      aria-label="Anuncios"
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: `ticker-scroll ${duration}s linear infinite` }}
      >
        {items.map((ad, i) => (
          <span
            key={i}
            className="text-dark text-sm lg:text-lg uppercase font-medium flex-shrink-0"
            style={{ fontFamily: 'var(--font-primary)', marginRight: '2rem' }}
          >
            {ad.message}
          </span>
        ))}
      </div>
    </div>
  );
}
