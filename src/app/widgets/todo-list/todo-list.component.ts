import { Component, OnInit } from '@angular/core';
import { ToDo } from '../../shared/interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { WhitespaceValidator } from '../../shared/whitespace.validator';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  toDoList: ToDo[] = [
    {id: 0, isDone: false, text: 'first todo'},
    {id: 1, isDone: true, text: 'second todo'},
    {id: 2, isDone: false, text: 'third todo'},
  ];

  form: FormGroup;
  isEdit = false;
  toDoEditing: ToDo;

  constructor() {
  }

  ngOnInit() {
    this.buildForm();
    console.log(this.toDoList)
  }

  buildForm(data?: ToDo) {
    this.form = new FormGroup({
      toDo: new FormControl(data ? data.text : null, WhitespaceValidator)
    });
  }

  addToDo() {
    let toDo: ToDo;

    if (this.isEdit) {
      this.toDoList.find((todo: ToDo) => {
        if (todo.id === this.toDoEditing.id) {
          todo.isDone = false;
          todo.text = this.form.value.toDo;
        }
      });
      this.isEdit = false;
      this.toDoEditing = null;
    } else {
      toDo = {
        id: this.highestId(),
        isDone: false,
        text: this.form.value.toDo
      };
      this.toDoList.unshift(toDo);
    }
    this.form.reset();
  }

  highestId() {
    const idArr = this.toDoList.sort((a, b) => b.id - a.id);
    return idArr[0].id + 1;
  }

  editToDo(id) {
    this.isEdit = true;
    this.toDoEditing = this.toDoList.find(todo => todo.id === id);
    this.buildForm(this.toDoEditing);
  }

  removeToDo(id) {
    this.toDoList = this.toDoList.filter(todo => todo.id !== id);
  }

  changeStatus(id) {
    this.toDoList.find((todo: ToDo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
        console.log(todo)
      }
    });
  }
}
