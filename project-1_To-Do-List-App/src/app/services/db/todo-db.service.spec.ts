import { TestBed } from '@angular/core/testing';
import { TodoDB } from './todo-db.service';

describe('Db', () => {
  let service: TodoDB;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
