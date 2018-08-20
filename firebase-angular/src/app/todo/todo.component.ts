import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  @Input()
  data: Todo;

  @Output()
  edit = new EventEmitter<Todo>();

  @Output()
  delete = new EventEmitter<Todo>();

  constructor() {}

  ngOnInit() {}

  editTodo(event: Event) {
    event.preventDefault();

    this.edit.emit(this.data);
  }

  deleteTodo(event: Event) {
    event.preventDefault();

    this.delete.emit(this.data);
  }
}
