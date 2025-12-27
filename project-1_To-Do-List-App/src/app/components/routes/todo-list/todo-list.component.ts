import { Component, signal } from '@angular/core';
import { db, Todo } from '../../../services/db/todo-db.service';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.component.html',
  standalone: true,
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);

  constructor() { 
    liveQuery(() => db.todos.toArray()).subscribe(all => {
      this.todos.set(all);
    }); 
  }
}
