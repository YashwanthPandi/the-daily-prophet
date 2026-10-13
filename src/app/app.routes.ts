import { Routes } from '@angular/router';
import { Recipes } from './features/recipes/recipes';
import { WorldNews } from './features/world-news/world-news';
import { Characters } from './features/characters/characters';
import { Folklore } from './features/folklore/folklore';
import { LoginComponent } from './features/login-component/login-component';
import { PotionDetails as ItemDetailComponent } from './shared/potion-details/potion-details';

// The router reads this list top to bottom and uses the FIRST path that
// matches the URL, so the catch-all '**' must always stay last.
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // The news front page IS the home page now.
  { path: 'home', component: WorldNews },
  { path: 'characters', component: Characters },
  { path: 'folklore', component: Folklore },
  { path: 'login',component: LoginComponent},
  { path: 'recipes', component: Recipes },
  // `:id` is a route PARAMETER: /recipes/42 opens this page with id = "42".
  // Living under /recipes/ means the "Recipes" nav link stays highlighted
  // (routerLinkActive matches the start of the URL).
  { path: 'recipes/:id', component: ItemDetailComponent },
  // Old addresses kept as redirects so existing bookmarks/links still work.
  // A redirect can carry parameters across: :id is copied into the new URL.
  { path: 'world-news', redirectTo: 'home' },
  { path: 'items/:id', redirectTo: 'recipes/:id' },
  { path: '**', redirectTo: 'home' }
];
