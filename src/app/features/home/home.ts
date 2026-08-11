import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { NewsArticle } from '../../core/models/news';
import { getFeaturedArticles } from '../../core/services/news.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ArticleCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly articles: NewsArticle[] = getFeaturedArticles();
}
