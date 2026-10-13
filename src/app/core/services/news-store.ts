import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewsService } from './news';
import { NewsArticle, NewsTopic } from '../models/news-article';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STATE ("store")
// The section tabs + search live in the header (MainHeader → NewsToolbar),
// but the articles are drawn by the World News page. Two components that
// aren't parent/child can't pass data with inputs, so we move the state into
// a root service. Angular gives every component the SAME instance, so when
// the toolbar calls `selectTopic()`, the page sees the new articles instantly.
//
// Two services, two jobs:
//   NewsService → HOW to fetch (HTTP + XML parsing). Stateless.
//   NewsStore   → WHAT the app currently shows (signals). Stateful.
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({
  providedIn: 'root',
})
export class NewsStore {
  private readonly api = inject(NewsService);
  private request?: Subscription;

  readonly topics = this.api.topics;

  // Private writable signals: only this class can change them...
  private readonly _articles = signal<NewsArticle[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedTopic = signal<NewsTopic>(this.topics[0]);
  private readonly _searchText = signal('');

  // ...and public read-only views of them. `asReadonly()` returns a signal
  // you can read but not `.set()`, so components must go through the methods
  // below. That keeps every state change in one place, easy to debug.
  readonly articles = this._articles.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedTopic = this._selectedTopic.asReadonly();
  readonly searchText = this._searchText.asReadonly();

  readonly filteredArticles = computed(() => {
    const term = this._searchText().trim().toLowerCase();
    if (!term) return this._articles();
    return this._articles().filter(
      (a) => a.title.toLowerCase().includes(term) || a.source.toLowerCase().includes(term),
    );
  });

  selectTopic(topic: NewsTopic): void {
    if (topic === this._selectedTopic()) return;
    this._selectedTopic.set(topic);
    this._searchText.set('');
    this.load();
  }

  setSearch(text: string): void {
    this._searchText.set(text);
  }

  load(): void {
    // If the user clicks topics quickly, cancel the older request so a slow
    // response can't overwrite a newer one.
    this.request?.unsubscribe();

    this._loading.set(true);
    this._error.set(null);

    // No takeUntilDestroyed here: a root service lives as long as the app,
    // and HTTP requests complete on their own after one response.
    this.request = this.api.getArticles(this._selectedTopic()).subscribe({
      next: (articles) => {
        this._articles.set(articles);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load Harry Potter news', err);
        this._error.set('The owls could not deliver today’s edition. Please try again.');
        this._articles.set([]);
        this._loading.set(false);
      },
    });
  }
}
