import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Potion } from '../../../core/models/potionsModel';
import { NewsPhoto } from '../../../shared/news-photo/news-photo';

// One potion, set like a recipe clipped out of the paper: bottle picture,
// name, effect, difficulty stamp, ingredients, and a link to the full page.
@Component({
  selector: 'app-recipe-clipping',
  imports: [RouterLink, NewsPhoto],
  templateUrl: './recipe-clipping.html',
  styleUrl: './recipe-clipping.scss',
})
export class RecipeClipping {
  readonly potion = input.required<Potion>();

  /** "Newt spleens, Bananas, An orange snake" → ["Newt spleens", "Bananas", …] */
  readonly ingredients = computed(() =>
    (this.potion().ingredients ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );
}
