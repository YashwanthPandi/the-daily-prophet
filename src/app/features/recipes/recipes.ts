import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Potions } from '../../core/services/recipes';
import { PotionAttributes } from '../../core/models/potionsModel';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
  standalone: true,
  imports: [CommonModule, MatTableModule],
})
export class Recipes implements OnInit, OnDestroy {
  potionsList = signal<PotionAttributes[]>([]);
  displayedColumns: string[] = ['name', 'effect', 'difficulty', 'ingredients'];
  private destroyed$ = new Subject<void>();

  constructor(private potions: Potions) {}

  ngOnInit(): void {
    this.potions
      .getAllPotions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response) => {
          this.potionsList.set((response.data ?? []).map((potion) => potion.attributes));
        },
        error: (err) => {
          console.error('Failed to load potions', err);
          this.potionsList.set([]);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
