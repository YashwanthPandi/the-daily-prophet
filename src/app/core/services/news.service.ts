import { NewsArticle } from '../models/news';

export type NewsCategory = 'home' | 'world-news' | 'matters-of-magic' | 'recipes';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'herb-rare-mandrake',
    title: 'Hogwarts Herbology Class Stunned by Rare Mandrake Bloom',
    category: 'home',
    summary: 'Professor Sprout confirms the first bloom in decades in a classroom greenhouse, promising wonder, caution, and renewed magical interest.',
    content: 'During a rare Hogwarts Herbology lecture, Professor Sprout revealed a mandrake specimen that has blossomed for the first time in generations. Students gathered in awe as the magical plant released its mysterious fragrance. Ministry researchers are expected to study the bloom for signs of new magical growth cycles.',
    author: 'Molly Weasley',
    publishedAt: '2026-05-13',
    imageUrl: 'https://i.pinimg.com/564x/15/34/07/1534070c6b8a6c16b05f84c50e3b4d41.jpg',
    layout: 'three',
    highlights: [
      'First bloom in decades',
      'Classroom greenhouse discovery',
      'Professor Sprout leads investigation'
    ],
    size: 'xl'
  },
  {
    id: 'ministry-muggle-chaos',
    title: 'Muggle at the Ministry… Delightful Chaos?',
    category: 'home',
    summary: 'A bright-eyed Muggle intern is causing a stir in the Department of Magical Accidents and Catastrophes with unexpected but charming results.',
    content: 'The Ministry reports that a Muggle assistant has brought unexpected efficiency to the Department of Magical Accidents and Catastrophes. While traditionalists are cautious, most witches and wizards are delighted by the humorous mishaps and fresh perspective.',
    author: 'Roger Davies',
    publishedAt: '2026-05-13',
    imageUrl: 'https://i.pinimg.com/564x/92/8d/f8/928df8e2a4670f4f5de4f5fdc20f6ab1.jpg',
    layout: 'two',
    size: 'large',
    highlights: [
      'Muggle intern joins the Ministry',
      'Department of Magical Accidents adapts',
      'Community embraces new storytelling'
    ]
  },
  {
    id: 'dragon-brew-recipe',
    title: 'A Sweet Dragonfire Pie Recipe for Winter Feast',
    category: 'recipes',
    summary: 'This seasonal pie uses dragonfire spices, enchanted berries, and a pinch of cinnamon for the perfect Hogwarts dessert.',
    content: 'Gather dragonfire cinnamon, goblin-sweetened honey, and autumn berries to create a cozy pie that warms the Great Hall. The recipe is simple enough for young witches and wizards yet delightful for seasoned cooks.',
    author: 'Hestia Jones',
    publishedAt: '2026-05-12',
    imageUrl: 'https://i.pinimg.com/564x/6f/7d/10/6f7d109f93d2df2d7361642caf9c83d4.jpg',
    layout: 'one',
    size: 'medium',
    highlights: [
      'Dragonfire spiced crust',
      'Perfect for feast nights',
      'Easy Hogwarts-friendly bake']
  },
  {
    id: 'phoenix-feather-brew',
    title: 'Phoenix Feather Potion Boosts Healing in Herbology',
    category: 'matters-of-magic',
    summary: 'A new potion experiment in Professor Sprout’s class is using phoenix feathers to strengthen magical plant healing properties.',
    content: 'Professor Sprout has approved a research potion that incorporates phoenix feather extracts. The experiment aims to accelerate growth and recovery in damaged magical flora, offering new hope for injured creatures and enchanted gardens alike.',
    author: 'Fleur Delacour',
    publishedAt: '2026-05-11',
    imageUrl: 'https://i.pinimg.com/564x/10/fd/2f/10fd2f0c0aada04090bae6f8b2c372ce.jpg',
    layout: 'two',
    highlights: [
      'Phoenix-feather infusion',
      'Improved plant healing',
      'Approved by Professor Sprout']
  },
  {
    id: 'wizarding-broadcast',
    title: 'Wizarding Wireless Broadcast Reports Ongoing White Owl Traffic',
    category: 'world-news',
    summary: 'The Wizarding Wireless is on air with updates from the Wizengamot and unusual sightings beyond the Forbidden Forest.',
    content: 'Listeners around the world are tuning into a new broadcast from the Wizarding Wireless. Reports include Wizengamot updates, unusual owl migrations near Hogwarts, and a new travel advisory for enchanted forest patrols.',
    author: 'Creevey Twins',
    publishedAt: '2026-05-14',
    imageUrl: 'https://i.pinimg.com/564x/9c/1d/cf/9c1dcf2f9dfd55700b5532f70d6b6d8c.jpg',
    layout: 'three',
    highlights: [
      'Wizengamot coverage',
      'Owl migration advisory',
      'New wireless travel news']
  }
];

export function getArticlesByCategory(category: NewsCategory): NewsArticle[] {
  return NEWS_ARTICLES.filter(article => article.category === category);
}

export function getFeaturedArticles(): NewsArticle[] {
  return NEWS_ARTICLES.filter(article => article.category === 'home');
}
