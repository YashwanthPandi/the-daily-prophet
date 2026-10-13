// A "model" is just a TypeScript interface describing the shape of our data.
// It has no runtime cost — it only exists so the compiler (and your editor)
// can catch typos like `article.titel` and autocomplete fields for you.

export interface NewsArticle {
  /** Stable id (feed guid or link), used by @for's `track` to avoid re-rendering. */
  id: string;
  /** Headline with the " - Source Name" suffix Google appends removed. */
  title: string;
  /** Link to the article. */
  link: string;
  /** Publication name, e.g. "Variety". */
  source: string;
  /** Homepage of the publication, e.g. "https://variety.com". */
  sourceUrl: string;
  /** Parsed publish date, so the DatePipe can format it in the template. */
  publishedAt: Date;
  /**
   * Photo for the story, or null. `string | null` is a "union type": the
   * compiler forces you to handle the null case before using it as a string.
   * Google's feed has no images; the ones we get come from Bing News.
   */
  imageUrl: string | null;
  /** One- or two-sentence summary ('' when the feed doesn't provide one). */
  summary: string;
}

// A section a reader can pick. Two queries because the two feeds understand
// different search syntax: Google handles OR and (brackets), while Bing
// returns nothing for those and wants plain keywords.
export interface NewsTopic {
  label: string;
  /** Google News search — the main source of headlines. */
  query: string;
  /**
   * Bing News searches — used for stories that come with photographs. Each
   * Bing search only returns ~10 stories (and not all have photos), so we
   * run several and merge them to get enough pictures for the tile mosaic.
   */
  photoQueries: string[];
}
