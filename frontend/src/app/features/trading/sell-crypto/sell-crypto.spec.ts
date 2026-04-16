import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellCryptoComponent } from './sell-crypto';

describe('SellCrypto', () => {
  let component: SellCryptoComponent;
  let fixture: ComponentFixture<SellCryptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellCryptoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellCryptoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
