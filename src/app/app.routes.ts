import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { MattersOfMagic } from './features/matters-of-magic/matters-of-magic';
import { Recipes } from './features/recipes/recipes';
import { WorldNews } from './features/world-news/world-news';
import { LoginComponent } from './features/login-component/login-component';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login',component: LoginComponent},
  { path: 'profile-page', component : Profile}, 
  { path: 'matters-of-magic', component: MattersOfMagic },
  { path: 'recipes', component: Recipes },
  { path: 'world-news', component: WorldNews },
  { path: '**', redirectTo: 'home' }
];
