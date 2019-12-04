import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  user: User;
  form: FormGroup;
  private unsubscriber: Subject<void> = new Subject<void>();
  isEdit = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getUserById();
    this.buildForm();
  }

  getUserById() {
    this.spinner.show();
    const userId = this.authService.userId;
    this.userService.getUserById(userId)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((user: User) => {
        if (user) {
          this.user = user;
          this.buildForm(user);
          this.spinner.hide();
        }
      }, () => {
        this.spinner.hide();
      });
  }

  buildForm(user?: User) {
    this.form = new FormGroup({
      userName: new FormControl(user ? user.userName : null, [Validators.required]),
      email: new FormControl(user ? user.email : null, [Validators.email, Validators.required]),
      oldPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  save() {
    console.log('save');
  }
}
