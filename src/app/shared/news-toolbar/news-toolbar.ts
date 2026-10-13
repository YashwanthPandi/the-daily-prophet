import { Component, inject } from '@angular/core';
import { NewsStore } from '../../core/services/news-store';

// The section tabs + search + refresh row. It lives inside the header's main
// nav, but it has no inputs: it reads and changes everything through the
// shared NewsStore, which the World News page also reads from.
@Component({
  selector: 'app-news-toolbar',
  templateUrl: './news-toolbar.html',
  styleUrl: './news-toolbar.scss',
})
export class NewsToolbar {
  // `protected`: usable in this component's template, hidden from other code.
  protected readonly store = inject(NewsStore);

  protected onSearch(event: Event): void {
    // event.target is typed as a generic EventTarget, so we tell TypeScript
    // it's really an <input> to read `.value`.
    this.store.setSearch((event.target as HTMLInputElement).value);
  }
}
