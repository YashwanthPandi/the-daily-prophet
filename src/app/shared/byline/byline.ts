import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NewsArticle } from '../../core/models/news-article';
import { sourceHost } from '../../core/utils/article';

// "Reported by VARIETY · Monday, 12 October 2026" + "Continued at variety.com ❧".
// Every story layout needs this, so it lives in ONE component instead of
// being copy-pasted into each of them.
@Component({
  selector: 'app-byline',
  imports: [DatePipe],
  template: `
    <p class="byline">
      @if (article().source) {
        Reported by <b>{{ article().source }}</b> ·
      }
      <time [attr.datetime]="article().publishedAt.toISOString()">
        {{ article().publishedAt | date: (compact() ? 'd MMM, h:mm a' : 'EEEE, d MMMM y') }}
      </time>
    </p>
    @if (showMore() && host()) {
      <a class="more" [href]="article().link" target="_blank" rel="noopener noreferrer">
        Continued at {{ host() }} <span aria-hidden="true">❧</span>
      </a>
    }
  `,
  styles: `
    :host { display: block; }
    .byline {
      margin: 0.3rem 0 0;
      font-family: var(--body);
      font-style: italic;
      font-size: 0.85rem;
      color: var(--ink-soft);
    }
    b {
      font-family: var(--small-caps);
      font-weight: 400;
      font-style: normal;
      color: var(--ink);
    }
    .more {
      font-family: var(--body);
      font-style: italic;
      font-size: 0.85rem;
      color: var(--accent);
      text-decoration: none;
    }
    .more:hover { text-decoration: underline; }
  `,
})
export class Byline {
  readonly article = input.required<NewsArticle>();
  /** Short date for small stories ("12 Oct, 9:15 AM"). */
  readonly compact = input(false);
  /** Show the "Continued at …" link under the byline. */
  readonly showMore = input(false);

  // A plain function from core/utils, wrapped in computed() so it only
  // re-runs when the article input changes.
  readonly host = computed(() => sourceHost(this.article()));
}
