import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { PotionDetails } from './potion-details';

describe('PotionDetails', () => {
  let component: PotionDetails;
  let fixture: ComponentFixture<PotionDetails>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotionDetails],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]), // for the "Back to Potions & Recipes" routerLink
        // Pretend we're on /recipes/abc: the component reads `id` from this.
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'abc' }) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PotionDetails);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // ngOnInit → requests the potion
  });

  afterEach(() => httpMock.verify());

  it('loads the potion (the API returns `data` as an object, not an array)', async () => {
    httpMock.expectOne('https://api.potterdb.com/v1/potions/abc').flush({
      data: {
        id: 'abc',
        type: 'potion',
        attributes: {
          slug: 'ageing-potion',
          name: 'Ageing Potion',
          effect: 'Aged drinker temporarily',
          difficulty: 'Advanced',
          ingredients: 'Newt spleens, Bananas',
          image: null,
          characteristics: 'Green',
          inventors: null,
          manufacturers: null,
          side_effects: null,
          time: null,
          wiki: null,
        },
      },
    });
    await fixture.whenStable();

    expect(component.potion()?.name).toBe('Ageing Potion');
    expect(component.ingredients()).toEqual(['Newt spleens', 'Bananas']);
    // Null fields are left out of the fact box
    expect(component.facts().map((f) => f.label)).toEqual(['Difficulty', 'Appearance']);
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Ageing Potion');
  });

  it('shows an error for an unknown potion', () => {
    httpMock
      .expectOne('https://api.potterdb.com/v1/potions/abc')
      .flush('not found', { status: 404, statusText: 'Not Found' });
    expect(component.error()).toBeTruthy();
  });
});
