import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MattersOfMagic } from './matters-of-magic';

describe('MattersOfMagic', () => {
  let component: MattersOfMagic;
  let fixture: ComponentFixture<MattersOfMagic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MattersOfMagic],
    }).compileComponents();

    fixture = TestBed.createComponent(MattersOfMagic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
