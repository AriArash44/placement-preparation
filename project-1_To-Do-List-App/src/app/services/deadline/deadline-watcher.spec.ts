import { TestBed } from '@angular/core/testing';

import { DeadlineWatcherService } from './deadline-watcher';

describe('DeadlineWatcher', () => {
  let service: DeadlineWatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeadlineWatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
