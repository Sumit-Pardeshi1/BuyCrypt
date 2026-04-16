import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingsList } from './holdings-list';

describe('HoldingsList', () => {
  let component: HoldingsList;
  let fixture: ComponentFixture<HoldingsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldingsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldingsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
