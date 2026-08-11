<<<<<<< HEAD
# The Daily Prophet

A newspaper-style Angular application that renders themed wizarding-world articles in a vintage print layout.

## Features

- Article-driven content pages for Home, World News, Matters of Magic, and Recipes
- Reusable newspaper-style article cards with optional images
- Size variants for small, medium, large, and xl cards
- Responsive layout and editorial typography
- Angular Router navigation using standalone components

## Prerequisites

- Node.js 20+
- npm 11+

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the local development server:

```bash
npm start
```

Open `http://localhost:4200/` in your browser. The app reloads automatically as you edit files.

## Build

Build the application for production:

```bash
npm run build
```

The production build output is written to `dist/the-daily-prophet`.

## Testing

Run unit tests:

```bash
npm test
```

## Project Structure

- `src/app/app.ts` — root app component
- `src/app/app.routes.ts` — route definitions
- `src/app/features/*` — feature pages for each category
- `src/app/shared/components/article-card/*` — reusable article card component
- `src/app/shared/layouts/*` — shared layout components like header/sidebar
- `src/app/core/services/news.service.ts` — article data source
- `src/app/core/models/news.ts` — article data model
- `src/styles.scss` — global styles

## Notes

This project is styled as a themed newspaper with serif typography, drop caps, and multi-column article presentation. It is a good foundation for editorial-style UI and content-focused layouts.

## Resources

- Angular: https://angular.io/
- Angular CLI: https://angular.dev/cli
- Vitest: https://vitest.dev/
=======
# the-daily-prophet
Harry Potter Inspired News Paper Website 
>>>>>>> f6ad6eb996190e49060b6eec3eca957460d31c9d
