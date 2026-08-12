import { TestBed } from '@angular/core/testing';

import { Shoe } from './shoe';

describe('Shoe', () => {
  let service: Shoe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shoe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
