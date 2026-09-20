import { TestBed } from '@angular/core/testing';
import { potions } from './recipes';

describe('Recipes', () => {
  let service: potions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(potions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
