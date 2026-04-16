import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCrypto } from './buy-crypto';

describe('BuyCrypto', () => {
  let component: BuyCrypto;
  let fixture: ComponentFixture<BuyCrypto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyCrypto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyCrypto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
