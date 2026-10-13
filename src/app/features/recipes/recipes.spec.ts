import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Recipes } from './recipes';

/** A fake page of the PotterDB API, in the same shape the real one returns. */
function page(potions: { id: string; name: string; difficulty?: string; image?: string }[], last = 1) {
  return {
    data: potions.map((p) => ({
      id: p.id,
      type: 'potion',
      attributes: {
        slug: p.id,
        name: p.name,
        difficulty: p.difficulty ?? null,
        image: p.image ?? null,
        effect: 'Does something magical',
        ingredients: 'Newt spleens, Bananas',
        characteristics: null,
        inventors: null,
        manufacturers: null,
        side_effects: null,
        time: null,
        wiki: null,
      },
    })),
    meta: { pagination: { current: 1, last, records: potions.length } },
  };
}

describe('Recipes', () => {
  let component: Recipes;
  let fixture: ComponentFixture<Recipes>;
  let httpMock: HttpTestingController;

  const isPage = (n: number) => (req: { url: string; params: { get(k: string): string | null } }) =>
    req.url === 'https://api.potterdb.com/v1/potions' && req.params.get('page[number]') === String(n);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recipes],
      // HttpClient for the API, a router for the routerLinks in the template
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Recipes);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // ngOnInit → requests page 1
  });

  afterEach(() => httpMock.verify());

  it('loads every page and sorts potions alphabetically', () => {
    httpMock.expectOne(isPage(1)).flush(page([{ id: '2', name: 'Wolfsbane' }], 2));
    httpMock.expectOne(isPage(2)).flush(page([{ id: '1', name: 'Amortentia' }], 2));

    expect(component.potions().map((p) => p.name)).toEqual(['Amortentia', 'Wolfsbane']);
    expect(component.loading()).toBe(false);
  });

  it('filters by messy difficulty values and by search text', () => {
    httpMock.expectOne(isPage(1)).flush(
      page([
        { id: '1', name: 'Amortentia', difficulty: 'Advanced' },
        { id: '2', name: 'Pepperup', difficulty: 'Moderate to advanced' },
        { id: '3', name: 'Cure for Boils', difficulty: 'Beginner' },
        { id: '4', name: 'Mystery Brew' },
      ]),
    );

    component.level.set(component.levels.find((l) => l.label === 'Advanced')!);
    expect(component.filtered().map((p) => p.name)).toEqual(['Amortentia', 'Pepperup']);

    component.level.set(component.levels.find((l) => l.label === 'Unrated')!);
    expect(component.filtered().map((p) => p.name)).toEqual(['Mystery Brew']);

    component.level.set(component.levels[0]); // All
    component.search.set('boils');
    expect(component.filtered().map((p) => p.name)).toEqual(['Cure for Boils']);
  });

  it('shows an error when the archive is unreachable', () => {
    httpMock.expectOne(isPage(1)).flush('down', { status: 503, statusText: 'Unavailable' });
    expect(component.error()).toBe(true);
    expect(component.loading()).toBe(false);
  });
});
