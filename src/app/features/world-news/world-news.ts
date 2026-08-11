import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { NewsArticle } from '../../core/models/news';
import { getArticlesByCategory } from '../../core/services/news.service';

@Component({
  selector: 'app-world-news',
  standalone: true,
  imports: [CommonModule, ArticleCard],
  templateUrl: './world-news.html',
  styleUrl: './world-news.scss',
})
export class WorldNews {
  readonly articles: NewsArticle[] = getArticlesByCategory('world-news');
}
