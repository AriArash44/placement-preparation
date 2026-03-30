import { TestBed } from '@angular/core/testing';
import { DeadlineWatcherService } from './deadline-watcher';
import { TodoDB } from '../db/todo-db.service';

describe('DeadlineWatcherService', () => {
  let service: DeadlineWatcherService;

  const mockDB = {
    todos: {
      toArray: jasmine.createSpy(),
      update: jasmine.createSpy()
    }
  };
  const mockSW = {
    showNotification: jasmine.createSpy()
  };

  beforeEach(() => {
    spyOn(window, 'setInterval');
    if (!navigator.serviceWorker) {
      Object.defineProperty(navigator, 'serviceWorker', {
        value: {
          getRegistration: () => Promise.resolve(mockSW)
        },
        configurable: true
      });
    } else {
      spyOn(navigator.serviceWorker, 'getRegistration')
        .and.returnValue(Promise.resolve(mockSW as any));
    }
    TestBed.configureTestingModule({
      providers: [
        DeadlineWatcherService,
        { provide: TodoDB, useValue: mockDB }
      ]
    });
    service = TestBed.inject(DeadlineWatcherService);
    mockDB.todos.toArray.calls.reset();
    mockDB.todos.update.calls.reset();
    mockSW.showNotification.calls.reset();
  });

  function useFakeNow(iso: string) {
    spyOn(Date, 'now').and.returnValue(new Date(iso).getTime());
  }

  function setTodos(list: any[]) {
    mockDB.todos.toArray.and.returnValue(Promise.resolve(list));
  }

  it('parseTime12hTo24h - should convert AM/PM correctly', () => {
    const fn = (service as any).parseTime12hTo24h.bind(service);
    expect(fn('12:00 AM')).toBe('00:00:00');
    expect(fn('01:20 AM')).toBe('01:20:00');
    expect(fn('12:00 PM')).toBe('12:00:00');
    expect(fn('01:45 PM')).toBe('13:45:00');
  });

  it('should mark overdue if deadline has passed', async () => {
    useFakeNow('2026-01-01T12:00:00');
    setTodos([
      {
        id: 1,
        title: 'Task A',
        dateDeadLine: '2026-01-01',
        timeDeadLine: '10:00 AM',
        state: 'in_progress',
        notified: false
      }
    ]);
    await service.checkOverdueOrNotif();
    expect(mockDB.todos.update).toHaveBeenCalledOnceWith(1, { state: 'overdue' });
  });

  it('should notify when deadline is < 1 hour and not notified yet', async () => {
    useFakeNow('2026-01-01T09:30:00');
    setTodos([
      {
        id: 10,
        title: 'Task B',
        dateDeadLine: '2026-01-01',
        timeDeadLine: '10:00 AM',
        state: 'in_progress',
        notified: false
      }
    ]);
    await service.checkOverdueOrNotif();
    expect(mockSW.showNotification).toHaveBeenCalledTimes(1);
    expect(mockDB.todos.update).toHaveBeenCalledOnceWith(10, { notified: true });
  });

  it('should NOT notify if already notified', async () => {
    useFakeNow('2026-01-01T09:30:00');
    setTodos([
      {
        id: 99,
        title: 'Already Notified',
        dateDeadLine: '2026-01-01',
        timeDeadLine: '10:00 AM',
        state: 'in_progress',
        notified: true
      }
    ]);
    await service.checkOverdueOrNotif();
    expect(mockSW.showNotification).not.toHaveBeenCalled();
    expect(mockDB.todos.update).not.toHaveBeenCalled();
  });

  it('should NOT notify if state != in_progress', async () => {
    useFakeNow('2026-01-01T09:30:00');
    setTodos([
      {
        id: 5,
        title: 'Wrong State',
        dateDeadLine: '2026-01-01',
        timeDeadLine: '10:00 AM',
        state: 'done',
        notified: false
      }
    ]);
    await service.checkOverdueOrNotif();
    expect(mockSW.showNotification).not.toHaveBeenCalled();
  });

  it('should NOT notify if deadline > 1h away', async () => {
    useFakeNow('2026-01-01T08:00:00');
    setTodos([
      {
        id: 7,
        title: 'Far',
        dateDeadLine: '2026-01-01',
        timeDeadLine: '10:00 AM',
        state: 'in_progress',
        notified: false
      }
    ]);
    await service.checkOverdueOrNotif();
    expect(mockSW.showNotification).not.toHaveBeenCalled();
  });

  it('should handle multiple todos correctly', async () => {
    useFakeNow('2026-01-01T09:45:00');
    setTodos([
      {
        id: 1,
        title: 'Almost Due',
        dateDeadLine: '2026-01-01',
        timeDeadLine: '10:00 AM',
        state: 'in_progress',
        notified: false
      },
      {
        id: 2,
        title: 'Far Away',
        dateDeadLine: '2026-01-01',
        timeDeadLine: '11:30 AM',
        state: 'in_progress',
        notified: false
      },
      {
        id: 3,
        title: 'Already Overdue',
        dateDeadLine: '2026-01-01',
        timeDeadLine: '09:00 AM',
        state: 'in_progress',
        notified: false
      }
    ]);
    await service.checkOverdueOrNotif();
    expect(mockSW.showNotification).toHaveBeenCalledTimes(1);
    expect(mockDB.todos.update).toHaveBeenCalledWith(1, { notified: true });
    expect(mockDB.todos.update).toHaveBeenCalledWith(3, { state: 'overdue' });
    expect(mockDB.todos.update).not.toHaveBeenCalledWith(2, jasmine.anything());
  });

  it('should handle empty todos without errors', async () => {
    useFakeNow('2026-01-01T09:00:00');
    setTodos([]);
    await service.checkOverdueOrNotif();
    expect(mockSW.showNotification).not.toHaveBeenCalled();
    expect(mockDB.todos.update).not.toHaveBeenCalled();
  });
});