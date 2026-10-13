import { NewsArticle } from '../models/news-article';

// Plain functions, not a service: they need no dependencies and hold no
// state, so there's nothing for Angular to inject. Any component can import
// and call them, including inside computed().

/** "https://www.variety.com" → "variety.com" ('' if the URL is missing or bad). */
export function sourceHost(article: NewsArticle): string {
  try {
    return new URL(article.sourceUrl).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** True for stories published less than 6 hours ago. */
export function isFresh(article: NewsArticle): boolean {
  return Date.now() - article.publishedAt.getTime() < 6 * 60 * 60 * 1000;
}

/**
 * "Rowling Writes Again" → ["Rowling", "Writes Again"]. Used by the
 * vertical-word layouts. A tiny first word looks lost printed sideways, so
 * while it has fewer than 4 letters we pull in the next word too:
 * '"So they want…' → ['"So they', 'want…'].
 */
export function splitFirstWord(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  let take = 1;
  while (take < words.length - 1 && words.slice(0, take).join('').replace(/[^\p{L}]/gu, '').length < 4) {
    take++;
  }
  return [words.slice(0, take).join(' '), words.slice(take).join(' ')];
}
