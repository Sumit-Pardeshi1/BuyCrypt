import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletOverview } from './wallet-overview';

describe('WalletOverview', () => {
  let component: WalletOverview;
  let fixture: ComponentFixture<WalletOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
