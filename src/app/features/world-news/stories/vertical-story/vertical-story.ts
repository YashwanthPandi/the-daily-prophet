import { Component, computed, input } from '@angular/core';
import { NewsArticle } from '../../../../core/models/news-article';
import { splitFirstWord } from '../../../../core/utils/article';
import { Headline } from '../../../../shared/headline/headline';
import { Byline } from '../../../../shared/byline/byline';
import { NewsPhoto } from '../../../../shared/news-photo/news-photo';

// One component, two looks — chosen by the `tone` input:
//   'slab'   → "THERE / IS NOTHING TO FEAR! / SAYS THE MINISTER":
//              first word printed vertically, heavy slab type, and the
//              source running down the right edge ("REPORTS VARIETY").
//   'gothic' → "DUMBLEDORE / DEMOTED FROM CHIEF WARLOCK in the WIZENGAMOT":
//              first word reads bottom-to-top, tall condensed type.
// Reusing one component with an input beats copy-pasting two near-identical ones.
export type VerticalTone = 'slab' | 'gothic';

@Component({
  selector: 'app-vertical-story',
  imports: [Headline, Byline, NewsPhoto],
  templateUrl: './vertical-story.html',
  styleUrl: './vertical-story.scss',
})
export class VerticalStory {
  readonly article = input.required<NewsArticle>();
  readonly tone = input<VerticalTone>('slab');

  // [firstWord, restOfTitle] — recalculated only when the article changes.
  readonly parts = computed(() => splitFirstWord(this.article().title));
}
