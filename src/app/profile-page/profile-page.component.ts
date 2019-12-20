import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { from, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch, MustNotMatch } from '../shared/must-match.validator';
import { Router } from '@angular/router';

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
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
    this.getUserById();
  }

  getUserById() {
    this.spinner.show();

    const userId = {
      idToken: this.authService.token
    };

    this.userService.getUserById(userId)
      .pipe(
        takeUntil(this.unsubscriber),
        switchMap(response => from(response.users)))
      .subscribe(
        (user: User) => {
          this.user = user;
          this.buildForm(this.user);
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toastr.warning('Something went wrong, try later');
        }
      );
  }

  buildForm(user?: User) {
    this.form = this.formBuilder.group({
      userName: new FormControl(user ? user.displayName : null, [Validators.required]),
      email: new FormControl(user ? user.email : null, [Validators.email, Validators.required]),
      oldPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required])
    }, {
      validators: [
        MustMatch('newPassword', 'confirmPassword'),
        MustNotMatch('oldPassword', 'newPassword')
      ]
    });
  }

  updateUserProfile() {

    this.spinner.show();

    if (this.authService.isAuthenticated()) {
      const user: User = {
        displayName: this.form.value.userName,
        email: this.form.value.email,
        password: this.form.value.newPassword,
        idToken: this.authService.token,
        returnSecureToken: true
      };

      this.userService.updateUserProfile(user)
        .pipe(takeUntil(this.unsubscriber))
        .subscribe(
          (response: User) => {
            this.authService.setToken(response);
            this.isEdit = false;
            this.form.get('oldPassword').reset();
            this.form.get('newPassword').reset();
            this.form.get('confirmPassword').reset();
            this.spinner.hide();
            this.toastr.success('You have successfully updated profile');
          },
          () => {
            this.spinner.hide();
            this.toastr.warning('Something went wrong, try later');
          }
        );
    } else {
      this.spinner.hide();
      this.authService.logout();
      this.router.navigate(['/login'], {
        queryParams: {
          loginAgain: true
        }
      });
    }
  }


  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
