import { TestBed } from '@angular/core/testing';

import { MarketService } from './market';

describe('Market', () => {
  let service: MarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
