import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resident } from './resident';

describe('Resident', () => {
  let component: Resident;
  let fixture: ComponentFixture<Resident>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resident],
    }).compileComponents();

    fixture = TestBed.createComponent(Resident);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
