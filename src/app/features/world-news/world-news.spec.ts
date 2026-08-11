import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldNews } from './world-news';

describe('WorldNews', () => {
  let component: WorldNews;
  let fixture: ComponentFixture<WorldNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldNews],
    }).compileComponents();

    fixture = TestBed.createComponent(WorldNews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
