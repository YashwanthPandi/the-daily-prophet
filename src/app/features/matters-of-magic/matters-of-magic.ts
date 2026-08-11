import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { NewsArticle } from '../../core/models/news';
import { getArticlesByCategory } from '../../core/services/news.service';

@Component({
  selector: 'app-matters-of-magic',
  standalone: true,
  imports: [CommonModule, ArticleCard],
  templateUrl: './matters-of-magic.html',
  styleUrl: './matters-of-magic.scss',
})
export class MattersOfMagic {
  readonly articles: NewsArticle[] = getArticlesByCategory('matters-of-magic');
}
