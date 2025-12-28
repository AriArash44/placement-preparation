import { Component, signal } from '@angular/core';
import { db, Todo } from '../../../services/db/todo-db.service';
import { liveQuery } from 'dexie';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-todo-list',
  imports: [MatExpansionModule],
  templateUrl: './todo-list.component.html',
  standalone: true,
  host:{
    class: "w-[clamp(250px,80%,700px)]"
  }
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);

  constructor() { 
    liveQuery(() => db.todos.toArray()).subscribe(all => {
      this.todos.set(all);
    }); 
  }
}
