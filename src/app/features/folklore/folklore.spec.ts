import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Folklore } from './folklore';

describe('Folklore', () => {
  let component: Folklore;
  let fixture: ComponentFixture<Folklore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Folklore],
    }).compileComponents();

    fixture = TestBed.createComponent(Folklore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
