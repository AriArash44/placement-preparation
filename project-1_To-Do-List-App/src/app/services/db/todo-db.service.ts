import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface Todo { 
  id?: number; 
  title: string; 
  dateDeadLine: string; 
  timeDeadLine: string; 
  description?: string; 
  state: 'in_progress' | 'done' | 'overdue';
  notified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoDB extends Dexie {
  todos!: Table<Todo, number>;

  constructor() { 
    super('TodoDB'); 
    this.version(1).stores({ 
      todos: '++id,title,dateDeadLine,timeDeadLine,description,state' 
    }); 
  }
}