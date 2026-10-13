import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Potions } from '../../core/services/recipes';
import { Potion } from '../../core/models/potionsModel';
import { NewsPhoto } from '../../shared/news-photo/news-photo';
import { RecipeClipping } from './recipe-clipping/recipe-clipping';

// Difficulty filters. The API's values are messy ("Moderate to advanced",
// "Moderate/Advanced", null…), so each filter is a small test function
// instead of an exact match. "Moderate to Advanced" shows under both.
interface Level {
  label: string;
  matches: (difficulty: string | null) => boolean;
}

const has = (word: string) => (d: string | null) => !!d && d.toLowerCase().includes(word);

const LEVELS: Level[] = [
  { label: 'All', matches: () => true },
  { label: 'Beginner', matches: has('beginner') },
  { label: 'Moderate', matches: has('moderate') },
  { label: 'Advanced', matches: has('advanced') },
  { label: 'O.W.L.', matches: has('ordinary wizarding level') },
  { label: 'Unrated', matches: (d) => !d },
];

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
  imports: [RouterLink, NewsPhoto, RecipeClipping],
})
export class Recipes implements OnInit {
  private readonly potionsApi = inject(Potions);
  private readonly destroyRef = inject(DestroyRef);

  readonly levels = LEVELS;

  // ── State (signals) ───────────────────────────────────────────────────────
  readonly potions = signal<Potion[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly level = signal<Level>(LEVELS[0]);
  readonly search = signal('');

  // ── Derived state (computed) ──────────────────────────────────────────────
  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.potions().filter(
      (p) =>
        this.level().matches(p.difficulty) &&
        (!term ||
          p.name.toLowerCase().includes(term) ||
          (p.effect ?? '').toLowerCase().includes(term) ||
          (p.ingredients ?? '').toLowerCase().includes(term)),
    );
  });

  /**
   * A different featured potion every day: day-of-year modulo the number of
   * candidates. Only potions with a picture AND ingredients qualify, and it
   * only shows on the unfiltered page.
   */
  readonly recipeOfTheDay = computed(() => {
    if (this.search() || this.level() !== LEVELS[0]) return null;
    const candidates = this.potions().filter((p) => p.image && p.ingredients && p.effect);
    if (!candidates.length) return null;
    const dayOfYear = Math.floor(Date.now() / 86_400_000);
    return candidates[dayOfYear % candidates.length];
  });

  /** The list below the featured potion, without repeating it. */
  readonly clippings = computed(() => this.filtered().filter((p) => p !== this.recipeOfTheDay()));

  ngOnInit(): void {
    this.potionsApi
      .getAllPotions()
      // Auto-unsubscribes when the page is left. This replaces the old
      // `destroyed$` Subject + ngOnDestroy pattern with one line.
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (potions) => {
          // Alphabetical, like a recipe index
          this.potions.set([...potions].sort((a, b) => a.name.localeCompare(b.name)));
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load potions', err);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
