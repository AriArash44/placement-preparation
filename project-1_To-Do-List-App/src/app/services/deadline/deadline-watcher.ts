import { Injectable, inject } from '@angular/core';
import { TodoDB } from '../db/todo-db.service';

@Injectable({
  providedIn: 'root'
})
export class DeadlineWatcherService {
  private db = inject(TodoDB);

  constructor() {
    setInterval(async () => {
      this.checkOverdueOrNotif();
    }, 60000);
  }

  private parseTime12hTo24h(timeString: string): string {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:00`;
  }

  private async notifyViaSW(title: string, body: string) {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return;
    await registration.showNotification(title, {
      body,
      icon: 'assets/icons/icon-192x192.png',
      tag: 'deadline-warning'
    });
  }

  async checkOverdueOrNotif() {
    const todos = await this.db.todos.toArray();
    const now = new Date(Date.now());
    const oneHour = 60 * 60 * 1000;
    for (const todo of todos) {
      if (todo.state === 'done') continue;
      const parsedTime = this.parseTime12hTo24h(todo.timeDeadLine);
      const deadline = new Date(`${todo.dateDeadLine}T${parsedTime}`);
      const timeLeft = deadline.getTime() - now.getTime();
      if (
        timeLeft <= oneHour &&
        timeLeft > 0 &&
        todo.state === 'in_progress' &&
        !todo.notified
      ) {
        await this.notifyViaSW(
          'Deadline soon ⏰',
          `Task "${todo.title}" has less than one hour left`
        );
        await this.db.todos.update(todo.id!, { notified: true });
      }
      if (now > deadline && todo.state === 'in_progress') {
        await this.db.todos.update(todo.id!, { state: 'overdue' });
      }
    }
  } 
}
