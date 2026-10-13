import { Component, OnInit, computed, inject } from '@angular/core';
import { NewsStore } from '../../core/services/news-store';
import { NewsArticle, NewsTopic } from '../../core/models/news-article';
import { LeadStory } from './stories/lead-story/lead-story';
import { VerticalStory } from './stories/vertical-story/vertical-story';
import { StackStory } from './stories/stack-story/stack-story';
import { ModuleStory, StoryKind } from './stories/module-story/module-story';
import { Adverts } from './adverts/adverts';

// ── "In Other News" layout plans ────────────────────────────────────────────
// Real newspapers are built from horizontal BANDS split into CELLS of
// different widths, each holding one big story or a stack of small ones.
// Every band here sits on a 12-column grid:
//   span  → how many of the 12 columns the cell takes
//   kinds → the stories it starts with
//   fill  → keep adding short "brief" stories until this cell is about as
//           tall as the tallest cell in the band, so columns end level
//           instead of leaving empty gaps (what a typesetter would do).
// Cycling through different plans is what makes the page look "unorderly":
// neighbouring bands never share the same column lines.
interface CellPlan {
  span: number;
  kinds: StoryKind[];
  fill?: boolean;
}

const BAND_PLANS: CellPlan[][] = [
  [
    { span: 3, kinds: ['brief'], fill: true },
    { span: 6, kinds: ['large'] },
    { span: 3, kinds: ['small', 'brief'], fill: true },
  ],
  [
    { span: 8, kinds: ['wide', 'brief'] },
    { span: 4, kinds: ['small'], fill: true },
  ],
  [
    { span: 4, kinds: ['small'], fill: true },
    { span: 3, kinds: ['brief'], fill: true },
    { span: 5, kinds: ['large'] },
  ],
  [
    { span: 5, kinds: ['small'], fill: true },
    { span: 7, kinds: ['large'] },
  ],
  [
    { span: 3, kinds: ['small'], fill: true },
    { span: 3, kinds: ['brief'], fill: true },
    { span: 6, kinds: ['wide', 'brief'] },
  ],
];

/**
 * Rough height of a story, in units of ~100px on a desktop screen. It
 * doesn't need to be exact — just good enough to balance the columns.
 * Photos scale with the cell's width (they keep a 16:10 shape).
 */
function estimateHeight(kind: StoryKind, span: number, article: NewsArticle): number {
  const photo = span * 0.7;
  switch (kind) {
    case 'large':
      return photo + 4;
    case 'wide':
      return Math.max(span * 0.37, 2.5);
    case 'small':
      return photo + 1.5;
    case 'brief':
      return (span <= 3 ? 1.3 : 1) + (article.summary ? 0.9 : 0);
  }
}

/** What the template loops over: bands → cells → stories. */
interface ModuleCell {
  span: number;
  stories: { article: NewsArticle; kind: StoryKind }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// The Home page: a front page laid out like the Daily Prophet film prop.
// It doesn't own the news state (that's NewsStore, shared with the header's
// section tabs). Its one job is deciding WHICH story goes in WHICH slot;
// the story components decide how each slot looks.
// ─────────────────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-world-news',
  imports: [LeadStory, VerticalStory, StackStory, ModuleStory, Adverts],
  templateUrl: './world-news.html',
  styleUrl: './world-news.scss',
})
export class WorldNews implements OnInit {
  private readonly store = inject(NewsStore);

  // Re-export the store's read-only signals so the template stays short:
  // `loading()` instead of `store.loading()`.
  readonly articles = this.store.articles;
  readonly filteredArticles = this.store.filteredArticles;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly searchText = this.store.searchText;
  readonly topics = this.store.topics;
  readonly selectedTopic = this.store.selectedTopic;

  // Fill the front page's slots. Stories WITH a photograph take the top
  // 4 spots, since the lead and the stacked story are built around pictures.
  readonly frontPage = computed(() => {
    const all = this.filteredArticles();
    // Array.sort is "stable": items that compare equal keep their order. So
    // sorting by "has a photo?" moves photo stories up but keeps each group
    // newest-first. `[...all]` copies first: sort() changes the array it's
    // called on, and a signal's value must never be mutated in place.
    const top = [...all].sort((a, b) => Number(!!b.imageUrl) - Number(!!a.imageUrl)).slice(0, 4);
    const rest = all.filter((article) => !top.includes(article));
    // The plain-text list under the lead takes stories WITHOUT photos, so
    // the photographed ones are saved for "In Other News".
    const also = rest.filter((article) => !article.imageUrl).slice(0, 5);
    return {
      lead: top[0],
      stack: top[1], // has a photo when one is available → right-hand column
      split: top[2], // "THERE / IS NOTHING TO FEAR" layout
      sidebar: top[3], // "DUMBLEDORE" layout
      also, // short list under the lead
      briefs: rest.filter((article) => !also.includes(article)), // "In Other News" bands
    };
  });

  // Small computed "views" (the unit tests read these).
  readonly leadStory = computed(() => this.frontPage().lead);
  readonly featuredStories = computed(() =>
    // A "type guard" filter: tells TypeScript the undefined slots are gone.
    [this.frontPage().stack, this.frontPage().split, this.frontPage().sidebar].filter(
      (article): article is NewsArticle => !!article,
    ),
  );
  readonly briefs = computed(() => this.frontPage().briefs);

  // "In Other News": pour the stories into the band plans above.
  readonly modules = computed(() => {
    // Two queues (copies, so the signal's own arrays are never changed).
    const photos = this.briefs().filter((a) => a.imageUrl);
    const texts = this.briefs().filter((a) => !a.imageUrl);

    /** Next story for a slot: photo slots prefer photo stories, briefs prefer text ones. */
    const next = (kind: StoryKind) =>
      kind === 'brief' ? (texts.shift() ?? photos.shift()) : (photos.shift() ?? texts.shift());

    const bands: { id: number; cells: ModuleCell[] }[] = [];
    for (let b = 0; photos.length + texts.length > 0; b++) {
      const plan = BAND_PLANS[b % BAND_PLANS.length];

      // 1. Give every cell its starting stories.
      const cells = plan.map((cellPlan) => ({
        plan: cellPlan,
        span: cellPlan.span,
        height: 0,
        stories: [] as ModuleCell['stories'],
      }));
      const add = (cell: (typeof cells)[number], kind: StoryKind): boolean => {
        const article = next(kind);
        if (!article) return false; // queues ran dry
        // A text story in a photo slot becomes a brief; a photo story
        // that lands in a brief slot (no text left) is shown as 'small'.
        const actual: StoryKind = !article.imageUrl ? 'brief' : kind === 'brief' ? 'small' : kind;
        cell.stories.push({ article, kind: actual });
        cell.height += estimateHeight(actual, cell.span, article);
        return true;
      };
      cells.forEach((cell) => cell.plan.kinds.forEach((kind) => add(cell, kind)));

      // 2. Top up the "fill" cells with briefs until they reach the
      //    tallest cell in the band (minus a little, to avoid overshooting).
      const target = Math.max(...cells.map((cell) => cell.height));
      for (const cell of cells.filter((c) => c.plan.fill)) {
        while (cell.height < target - 0.6 && add(cell, 'brief')) {
          // add() did the work; loop until tall enough or out of stories
        }
      }

      const filled: ModuleCell[] = cells
        .filter((cell) => cell.stories.length > 0)
        .map(({ span, stories }) => ({ span, stories }));
      if (filled.length === 0) break;

      // On the last, partly filled band, let the final cell take up the
      // leftover columns so the band still spans the full width.
      const used = filled.slice(0, -1).reduce((sum, cell) => sum + cell.span, 0);
      filled[filled.length - 1].span = 12 - used;

      bands.push({ id: b, cells: filled });
    }
    return bands;
  });

  // ngOnInit runs once, after Angular has created the component. Fetch a
  // fresh edition every time the reader opens the page.
  ngOnInit(): void {
    this.store.load();
  }

  /** The footer index ("— HBO Series 2 — Games 4 —") switches section. */
  openSection(topic: NewsTopic): void {
    this.store.selectTopic(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
