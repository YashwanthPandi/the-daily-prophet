import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { NewsArticle, NewsTopic } from '../models/news-article';

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES IN ANGULAR
// A service is a class that holds logic that isn't about drawing the screen:
// fetching data, caching, talking to APIs. Components ask for it instead of
// creating it themselves ("dependency injection").
//
// `providedIn: 'root'` means Angular creates ONE shared instance for the whole
// app the first time someone asks for it. No need to register it anywhere.
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({
  providedIn: 'root',
})
export class NewsService {
  // `inject()` is the modern way to get a dependency. It does the same job as
  // the `constructor(private http: HttpClient)` style used in recipes.ts —
  // both are valid, inject() is just shorter and works in more places.
  private readonly http = inject(HttpClient);

  // Why '/google-news' and not 'https://news.google.com'?
  // Browsers block pages from reading responses from other domains unless that
  // domain allows it (CORS), and Google News doesn't. So during `ng serve` we
  // call our OWN dev server, and proxy.conf.json forwards the request
  // server-side, where CORS doesn't apply. Same trick for Bing.
  private readonly googleUrl = '/google-news/rss/search';
  private readonly bingUrl = '/bing-news/news/search';

  // `readonly` + a plain array: the topic list never changes at runtime.
  readonly topics: NewsTopic[] = [
    {
      label: 'All the Wizarding World',
      query: '"Harry Potter" OR "Wizarding World" OR Hogwarts',
      photoQueries: [
        'Harry Potter',
        'Hogwarts',
        'Harry Potter HBO',
        'Harry Potter fans',
        'Hogwarts Legacy',
        'Harry Potter cast',
        'Harry Potter LEGO',
        'Harry Potter Halloween',
      ],
    },
    {
      label: 'HBO Series',
      query: '"Harry Potter" HBO series',
      photoQueries: [
        'Harry Potter HBO series',
        'Harry Potter HBO cast',
        'HBO Hogwarts series',
        'Harry Potter TV show',
      ],
    },
    {
      label: 'Films & Cast',
      query: '"Harry Potter" (Radcliffe OR Watson OR Grint OR film)',
      photoQueries: [
        'Harry Potter movie cast',
        'Harry Potter actor',
        'Harry Potter star',
        'Harry Potter reunion',
        'Harry Potter film',
        'Daniel Radcliffe Harry Potter',
      ],
    },
    {
      label: 'Games',
      query: '"Hogwarts Legacy" OR "Harry Potter" game',
      photoQueries: [
        'Hogwarts Legacy',
        'Harry Potter game',
        'Hogwarts Legacy update',
        'Harry Potter video game',
        'Hogwarts Legacy 2',
      ],
    },
    {
      label: 'Books & Stage',
      query: '"Harry Potter" (book OR "Cursed Child" OR Rowling)',
      photoQueries: [
        'Harry Potter books Rowling',
        'Harry Potter book',
        'Cursed Child Broadway',
        'Harry Potter Cursed Child',
      ],
    },
    {
      label: 'Theme Parks',
      query: '"Wizarding World of Harry Potter" OR "Harry Potter" studio tour',
      photoQueries: [
        'Wizarding World of Harry Potter Universal',
        'Harry Potter studio tour',
        'Epic Universe Harry Potter',
        'Universal Orlando Harry Potter',
        'Warner Bros Harry Potter',
      ],
    },
  ];

  /**
   * Fetches one edition for a topic: Google's headlines plus Bing's
   * photographed stories, merged into one list, newest first.
   *
   * Returns an Observable: think of it as a "recipe" for a request. Nothing is
   * sent until someone calls `.subscribe()` on it (NewsStore does that).
   */
  getArticles(topic: NewsTopic): Observable<NewsArticle[]> {
    // `forkJoin` runs several Observables IN PARALLEL and emits once, when
    // all of them have finished, with an object of their results. Both
    // requests go out at the same moment, so the page isn't twice as slow.
    return forkJoin({
      google: this.getGoogle(topic.query),
      bing: this.getAllBing(topic.photoQueries),
    }).pipe(map(({ google, bing }) => this.merge(google, bing)));
  }

  /**
   * Runs every Bing search in parallel and flattens the results into one
   * list. forkJoin also accepts an ARRAY of Observables and emits an array
   * of their results: [[...query 1], [...query 2], ...] → .flat() → [...].
   */
  private getAllBing(queries: string[]): Observable<NewsArticle[]> {
    return forkJoin(
      queries.map((query) =>
        // Photos are a bonus. If one Bing search fails, `catchError` swaps
        // the error for an empty list (`of([])`), so the other searches and
        // Google's headlines still show up. Without it, one failed request
        // would fail the whole forkJoin.
        this.getBing(query).pipe(catchError(() => of([] as NewsArticle[]))),
      ),
    ).pipe(map((lists) => lists.flat()));
  }

  private getGoogle(query: string): Observable<NewsArticle[]> {
    // HttpParams-style object: Angular URL-encodes each value for us.
    const params = { q: query, hl: 'en-US', gl: 'US', ceid: 'US:en' };

    // HttpClient parses JSON by default. RSS is XML, so we ask for raw text
    // and parse it ourselves. `pipe` chains RxJS operators; `map` transforms
    // the emitted value: XML string in → array of NewsArticle out.
    return this.http
      .get(this.googleUrl, { params, responseType: 'text' })
      .pipe(map((xml) => this.parseGoogle(xml)));
  }

  private getBing(query: string): Observable<NewsArticle[]> {
    return this.http
      .get(this.bingUrl, { params: { q: query, format: 'rss' }, responseType: 'text' })
      .pipe(map((xml) => this.parseBing(xml)));
  }

  /**
   * Combines both feeds. The same story often appears in both, so we key
   * each one by a simplified title; Bing's copy is added second and wins,
   * because it carries the photo and summary.
   */
  private merge(google: NewsArticle[], bing: NewsArticle[]): NewsArticle[] {
    const byTitle = new Map<string, NewsArticle>();
    for (const article of [...google, ...bing]) {
      byTitle.set(this.titleKey(article.title), article);
    }
    // Google orders by relevance; a newspaper should show the newest first.
    return [...byTitle.values()].sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    );
  }

  /** "‘Harry Potter’ Returns!" → "harrypotterreturns" — ignores quotes/punctuation. */
  private titleKey(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
  }

  // ── Parsing ───────────────────────────────────────────────────────────────

  /** DOMParser is a built-in browser API — no library needed. */
  private items(xml: string): Element[] {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return Array.from(doc.getElementsByTagName('item'));
  }

  /** Text of the first child tag, or ''. getElementsByTagName also matches
   *  namespaced tags like <News:Image>, which CSS selectors can't. */
  private text(item: Element, tag: string): string {
    return item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
  }

  private parseGoogle(xml: string): NewsArticle[] {
    return this.items(xml).map((item) => {
      const source = this.text(item, 'source');
      return {
        id: this.text(item, 'guid') || this.text(item, 'link'),
        title: this.stripSourceSuffix(this.text(item, 'title'), source),
        link: this.text(item, 'link'),
        source,
        sourceUrl: item.getElementsByTagName('source')[0]?.getAttribute('url') ?? '',
        publishedAt: new Date(this.text(item, 'pubDate')),
        imageUrl: null, // Google's feed never includes images
        summary: '', // its <description> just repeats the headline as HTML
      };
    });
  }

  private parseBing(xml: string): NewsArticle[] {
    return this.items(xml).map((item) => {
      // Bing's <link> is a click-tracking URL; the real article address is
      // in its `url=` query parameter. The URL class parses that for us.
      const trackingLink = this.text(item, 'link');
      const link = this.safeUrl(trackingLink)?.searchParams.get('url') ?? trackingLink;

      return {
        id: link,
        title: this.text(item, 'title'),
        link,
        // "Screen Rant on MSN" → "Screen Rant"
        source: this.text(item, 'News:Source').replace(/ on MSN$/, ''),
        sourceUrl: this.safeUrl(link)?.origin ?? '',
        publishedAt: new Date(this.text(item, 'pubDate')),
        imageUrl: this.photoUrl(this.text(item, 'News:Image')),
        summary: this.text(item, 'description'),
      };
    });
  }

  /**
   * Bing gives a small http:// thumbnail URL. Ask for a 16:9 800×450 crop
   * over https (http images get blocked on https pages as "mixed content").
   */
  private photoUrl(raw: string): string | null {
    const url = this.safeUrl(raw);
    if (!url) return null;
    url.protocol = 'https:';
    url.searchParams.set('w', '800');
    url.searchParams.set('h', '450');
    url.searchParams.set('c', '7'); // Bing's "smart crop" around the subject
    // Thumbnails are often smaller than 800×450, and by default Bing PADS
    // them with white to the requested size. rs=1 (scale up) + p=0 (no
    // padding) gives a full-bleed photo instead.
    url.searchParams.set('rs', '1');
    url.searchParams.set('p', '0');
    return url.toString();
  }

  /** `new URL()` throws on bad input; this returns null instead. */
  private safeUrl(value: string): URL | null {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  }

  /** Google titles look like "Headline - Variety"; drop the " - Variety" part. */
  private stripSourceSuffix(title: string, source: string): string {
    const suffix = ` - ${source}`;
    return source && title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
  }
}
