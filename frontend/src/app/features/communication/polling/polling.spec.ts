import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Polling } from './polling';

describe('Polling', () => {
  let component: Polling;
  let fixture: ComponentFixture<Polling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Polling],
    }).compileComponents();

    fixture = TestBed.createComponent(Polling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
