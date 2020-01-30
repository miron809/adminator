import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToDo } from '../../shared/interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { WhitespaceValidator } from '../../shared/whitespace.validator';
import { TodoListService } from './todo-list.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, throttle, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit, OnDestroy {

  todoList: ToDo[] = [];
  changingStatus$ = new Subject();

  form: FormGroup;
  isEdit = false;
  toDoEditing: ToDo;

  constructor(private todoListService: TodoListService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show('todoList');
    this.getAllToDo();
    this.updateStatus();
    this.buildForm();
  }

  buildForm(data?: ToDo) {
    this.form = new FormGroup({
      todo: new FormControl(data ? data.text : null, WhitespaceValidator)
    });
  }

  getAllToDo() {
    this.todoListService.getAll()
      .pipe(untilDestroyed(this))
      .subscribe((todoList: ToDo[]) => {
        console.log(todoList)
        this.todoList = todoList;
        this.spinner.hide('todoList');
      }, (error) => this.hideSpinner(error));
  }

  submit() {
    this.spinner.show('todoList');
    this.isEdit ? this.updateToDo() : this.addToDo();
    this.form.reset();
  }

  addToDo() {
    const toDo = {
      isDone: false,
      text: this.form.value.todo
    };

    this.todoListService.create(toDo)
      .subscribe(response => {
        this.todoList.unshift(toDo);
        this.toastr.success('New item has been successfully added');
        this.spinner.hide('todoList');
      }, (error) => this.hideSpinner(error));
  }

  updateToDo(data?) {
    let todo: ToDo;

    if (data) {
      todo = data;
    } else {
      todo = {
        text: this.form.value.todo,
        id: this.toDoEditing.id
      };
    }

    this.todoListService.update(todo)
      .subscribe(() => {
        this.todoList.find((item: ToDo) => {
          if (item.id === todo.id) {
            item.text = todo.text;
          }
        });
        this.isEdit = false;
        this.toDoEditing = null;
        this.spinner.hide('todoList');
      }, (error) => this.hideSpinner(error));
  }

  editToDo(todo) {
    this.isEdit = true;
    this.toDoEditing = todo;
    this.buildForm(todo);
  }

  removeToDo(id) {
    this.spinner.show('todoList');
    this.todoListService.remove(id)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.todoList = this.todoList.filter(todo => todo.id !== id);
        this.toastr.success('Item has been successfully removed');
        this.spinner.hide('todoList');
      }, (error) => this.hideSpinner(error));
  }

  changeStatus(id) {
    this.todoList.find((todo: ToDo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
      }
    });
    this.changingStatus$.next(id);
  }

  updateStatus() {
    this.changingStatus$
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        const todo = this.todoList.find(item => item.id === id);
        this.updateToDo(todo);
      });
  }

  hideSpinner(error) {
    this.spinner.hide('todoList');
    if (error.statusText) {
      this.toastr.error(error.statusText);
    }
  }

  ngOnDestroy(): void {
  }
}
