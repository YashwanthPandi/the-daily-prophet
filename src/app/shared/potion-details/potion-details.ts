import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Potion } from '../../core/models/potionsModel';
import { Potions } from '../../core/services/recipes';
import { NewsPhoto } from '../news-photo/news-photo';

@Component({
  imports: [RouterLink, NewsPhoto],
  selector: 'app-potion-details',
  styleUrl: './potion-details.scss',
  templateUrl: './potion-details.html',
})
export class PotionDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private potions = inject(Potions);

  // WHY SIGNALS HERE: this app runs "zoneless" (there's no zone.js), so
  // Angular doesn't automatically re-render after an HTTP response. The old
  // version set a plain property (`this.potionDetails = …`), which changed
  // the value but never redrew the page. Setting a signal tells Angular
  // exactly what changed, so the template updates.
  readonly potion = signal<Potion | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** The fact box: only rows that have a value (`null` fields are skipped). */
  readonly facts = computed(() => {
    const p = this.potion();
    if (!p) return [];
    return [
      { label: 'Difficulty', value: p.difficulty },
      { label: 'Brewing time', value: p.time },
      { label: 'Appearance', value: p.characteristics },
      { label: 'Side effects', value: p.side_effects },
      { label: 'Invented by', value: p.inventors },
      { label: 'Made by', value: p.manufacturers },
    ].filter((fact) => !!fact.value);
  });

  readonly ingredients = computed(() =>
    (this.potion()?.ingredients ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );

  ngOnInit(): void {
    // `snapshot` = the URL as it was when this page opened. /recipes/:id → id
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No potion was named in the address.');
      this.loading.set(false);
      return;
    }

    this.potions.getPotionById(id).subscribe({
      next: (potion) => {
        this.potion.set(potion);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load potion details', error);
        this.error.set('That recipe could not be found in the archive.');
        this.loading.set(false);
      },
    });
  }
}
