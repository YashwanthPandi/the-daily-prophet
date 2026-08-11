import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { NewsArticle } from '../../core/models/news';
import { getArticlesByCategory } from '../../core/services/news.service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, ArticleCard],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes {
  readonly articles: NewsArticle[] = getArticlesByCategory('recipes');
}
