import { Component, OnInit } from '@angular/core';
import { Potions } from '../../core/services/recipes';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.html',
  standalone: true
})
export class Recipes implements OnInit {
  potionsList: any[] = [];

  constructor(private potions: Potions) {}

  ngOnInit(): void {
    debugger
    this.potions.getAllPotions().subscribe({
      next: (response: any) => {
        this.potionsList = response?.data ?? [];
      },
      error: (err) => {
        // API failed; fall through to empty state instead of hanging on loading
        console.error('Failed to load potions', err);
        this.potionsList = [];
      }
    });
  }
}