import { Injectable } from '@angular/core';
import { db } from '../db/todo-db.service';

@Injectable({
  providedIn: 'root'
})
export class DeadlineWatcherService {
  constructor() {
    this.start();
  }

  private start() {
    setInterval(async () => {
      const todos = await db.todos.toArray();
      const now = new Date();
      for (const todo of todos) {
        if (todo.state === 'done') continue;
        const parsedTime = this.parseTime12hTo24h(todo.timeDeadLine);
        const deadline = new Date(`${todo.dateDeadLine}T${parsedTime}`);
        if (now > deadline) {
          await db.todos.update(todo.id!, { state: 'overdue' });
        }
      }
    }, 60000);
  }

  private parseTime12hTo24h(timeString: string): string {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }
}
