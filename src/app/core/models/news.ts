export interface NewsArticle {
  id: string;
  title: string;
  category: 'home' | 'world-news' | 'matters-of-magic' | 'recipes';
  layout?: 'one' | 'two' | 'three';
  size?: 'small' | 'medium' | 'large' | 'xl';
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  highlights: string[];
}
