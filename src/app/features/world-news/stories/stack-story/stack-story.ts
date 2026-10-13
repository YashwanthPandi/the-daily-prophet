import { Component, input } from '@angular/core';
import { NewsArticle } from '../../../../core/models/news-article';
import { Headline } from '../../../../shared/headline/headline';
import { Byline } from '../../../../shared/byline/byline';
import { NewsPhoto } from '../../../../shared/news-photo/news-photo';

// The prop's right-hand "☞ MADAM MARCHBANK Denies Links to Subversive
// GOBLIN GROUPS" block: a pointing hand and a centred, stacked headline
// in tall condensed type, here with a small photo on top.
@Component({
  selector: 'app-stack-story',
  imports: [Headline, Byline, NewsPhoto],
  template: `
    <article>
      @if (article().imageUrl; as src) {
        <app-news-photo [src]="src" [caption]="'Photograph courtesy of ' + article().source" />
      }
      <h2 class="title">
        <a class="dp-link" [href]="article().link" target="_blank" rel="noopener noreferrer">
          <span class="hand" aria-hidden="true">☞</span>
          <app-headline [text]="article().title" />
        </a>
      </h2>
      @if (article().summary) {
        <p class="dp-body">{{ article().summary }}</p>
      }
      <app-byline [article]="article()" [showMore]="true" />
    </article>
  `,
  styles: `
    :host { display: block; text-align: center; }
    app-news-photo { margin-bottom: 0.75rem; }
    .title {
      margin: 0 0 0.6rem;
      font-family: var(--headline);
      font-weight: 400;
      font-size: clamp(2rem, 3vw, 2.8rem);
      line-height: 1;
      text-transform: uppercase;
    }
    .hand { font-family: var(--body); margin-right: 0.15em; }
  `,
})
export class StackStory {
  readonly article = input.required<NewsArticle>();
}
