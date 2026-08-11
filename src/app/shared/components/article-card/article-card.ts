import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsArticle } from '../../../core/models/news';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-card.html',
  styleUrls: ['./article-card.scss'],
})
export class ArticleCard {
  @Input() article!: NewsArticle;

  get layout(): 'one' | 'two' {
    return this.article.layout === 'two' ? 'two' : 'one';
  }

  get size(): 'small' | 'medium' | 'large' | 'xl' {
    return this.article.size ?? 'medium';
  }

  get sizeClass(): string {
    return `size-${this.size}`;
  }
}
