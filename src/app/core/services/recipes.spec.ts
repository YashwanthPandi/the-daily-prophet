import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Potions } from './recipes';

describe('Recipes', () => {
  let service: Potions;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(Potions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
