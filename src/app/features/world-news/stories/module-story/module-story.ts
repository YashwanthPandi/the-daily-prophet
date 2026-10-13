import { Component, computed, input } from '@angular/core';
import { NewsArticle } from '../../../../core/models/news-article';
import { Headline } from '../../../../shared/headline/headline';
import { Byline } from '../../../../shared/byline/byline';
import { NewsPhoto } from '../../../../shared/news-photo/news-photo';

// How a story is set inside a newspaper "module" (a cell of a band):
//   large → big photo, slab headline, summary flowing in 2 text columns
//   wide  → photo on the left, headline + summary on the right
//   small → small photo above a condensed headline
//   brief → serif headline + summary, no photo
// Unlike fixed-size tiles, every kind is exactly as tall as its content.
export type StoryKind = 'large' | 'wide' | 'small' | 'brief';

@Component({
  selector: 'app-module-story',
  imports: [Headline, Byline, NewsPhoto],
  templateUrl: './module-story.html',
  styleUrl: './module-story.scss',
  // e.g. <app-module-story class="kind-large"> — the stylesheet targets
  // each kind with :host(.kind-large) etc.
  host: { '[class]': "'kind-' + kind()" },
})
export class ModuleStory {
  readonly article = input.required<NewsArticle>();
  readonly kind = input<StoryKind>('brief');

  /** The photo to show, or null: briefs never show one. */
  readonly photo = computed(() => (this.kind() === 'brief' ? null : this.article().imageUrl));
}
