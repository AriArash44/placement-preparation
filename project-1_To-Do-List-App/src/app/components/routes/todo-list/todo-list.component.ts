import { Component, signal, inject } from '@angular/core';
import { db, Todo } from '../../../services/db/todo-db.service';
import { liveQuery } from 'dexie';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-todo-list',
  imports: [MatExpansionModule, DatePipe],
  templateUrl: './todo-list.component.html',
  standalone: true,
  host:{
    class: "w-[clamp(250px,80%,700px)]"
  }
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);
  isSmallScreen = signal(false);

  private breakpointObserver = inject(BreakpointObserver);

  constructor() { 
    liveQuery(() => db.todos.toArray()).subscribe(all => {
      this.todos.set(all);
    }); 
  }

  ngOnInit() { 
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall]) 
      .subscribe(result => { 
        this.isSmallScreen.set(result.matches); 
      }); 
  }
}
