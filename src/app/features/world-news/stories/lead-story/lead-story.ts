import { Component, computed, input } from '@angular/core';
import { NewsArticle } from '../../../../core/models/news-article';
import { isFresh } from '../../../../core/utils/article';
import { Headline } from '../../../../shared/headline/headline';
import { Byline } from '../../../../shared/byline/byline';
import { NewsPhoto } from '../../../../shared/news-photo/news-photo';

// The splash story — the prop's "☞ EXCLUSIVE / BOY WHO LIVED" block:
// inverted kicker, giant slab headline, then a text column beside a big photo.
@Component({
  selector: 'app-lead-story',
  // A component can only use the components it lists here.
  imports: [Headline, Byline, NewsPhoto],
  templateUrl: './lead-story.html',
  styleUrl: './lead-story.scss',
})
export class LeadStory {
  readonly article = input.required<NewsArticle>();
  /** A few extra headlines listed under "Also in this Edition". */
  readonly also = input<NewsArticle[]>([]);

  readonly kicker = computed(() => (isFresh(this.article()) ? 'Stop Press' : 'Latest Dispatch'));
}
