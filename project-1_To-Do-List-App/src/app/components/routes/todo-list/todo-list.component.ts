import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

class AddTodoFormFeilds {
  constructor(    
    public title: string,    
    public dateDeadLine: string,
    public timeDeadLine: string,
    public description?: string,    
  ) {}
}

@Component({
  selector: 'app-todo-list',
  imports: [FormsModule, NgxMatTimepickerModule],
  templateUrl: './todo-list.component.html',
  standalone: true,
})
export class TodoListComponent {
  model = new AddTodoFormFeilds('', '', '', '');
  onSubmit() { 
    console.log('Form submitted:', this.model); 
  }
}
