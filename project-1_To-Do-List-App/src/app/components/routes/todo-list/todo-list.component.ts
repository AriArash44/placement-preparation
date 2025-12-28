import { Component, signal, computed, inject, viewChild } from '@angular/core';
import { db, Todo } from '../../../services/db/todo-db.service';
import { liveQuery } from 'dexie';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe, CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Modal } from '../../common/modal/modal.component';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  imports: [MatExpansionModule, DatePipe, Modal, CommonModule],
  templateUrl: './todo-list.component.html',
  standalone: true,
  host:{
    class: "w-[clamp(250px,80%,700px)]"
  }
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);
  isSmallScreen = signal(false);
  modalControler = signal(false);
  currentTemplate = signal<"delete" | "update">("delete");
  selectedTodo = signal<Todo | null>(null);

  deleteFragment = viewChild<TemplateRef<unknown>>('deleteFragment');    
  updateFragment = viewChild<TemplateRef<unknown>>('updateFragment');

  modalContent = computed(() =>
    this.currentTemplate() === 'delete'
      ? this.deleteFragment()
      : this.updateFragment()
  );

  modalContext = computed(() => ({ $implicit: this.selectedTodo() }));

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

  showUpdateOrDelete(type: "delete" | "update", todo: Todo, event: Event) {
    event.stopPropagation();
    this.currentTemplate.set(type);
    this.selectedTodo.set(todo);
    this.modalControler.set(true);
  }

  async deleteTodo(id: number) {
    if (id == null) return;
    await db.todos.delete(id);
    this.modalControler.set(false);
    this.selectedTodo.set(null);
  }

}
