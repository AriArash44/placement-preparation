import { Routes } from '@angular/router';
import { AddTaskComponent } from './components/routes/add-task/add-task.component';
import { TodoListComponent } from './components/routes/todo-list/todo-list.component';

export const routes: Routes = [
  { 
    path: '', 
    component: TodoListComponent 
  }, { 
    path: 'add', 
    component: AddTaskComponent,
    canDeactivate: [(component: AddTaskComponent) => component.hasUnsavedChanges() ? confirm('You have unsaved changes. Are you sure you want to leave?') : true],
  }
];
