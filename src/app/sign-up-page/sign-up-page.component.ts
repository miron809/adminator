import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MustMatch } from '../shared/must-match.validator';
import { User } from '../shared/interfaces';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../shared/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  submitted = false;
  user: User;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      userName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required])
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.spinner.show();

    const user: User = {
      userName: this.form.value.userName,
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    };
    this.signUp(user);
  }

  signUp(user: User) {
    this.authService.signUp(user)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((response) => {
          this.form.reset();
          this.submitted = false;
          this.spinner.hide();
          this.getGitHubUser(user, response.localId);
        }, () => {
          this.submitted = false;
          this.spinner.hide();
        }
      );
  }

  getGitHubUser(user: User, userId) {
    this.spinner.show();
    this.userService.getGitHubInfo(user.userName)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(
        (gitHubUserInfo) => {
          if (gitHubUserInfo) {
            this.user = {
              userName: gitHubUserInfo.name,
              avatar: gitHubUserInfo.avatar_url,
              email: user.email,
              userId,
            };
          }
          this.createUser(this.user);
        },
        () => {
          const random = Math.floor(Math.random() * Math.floor(100));
          this.user = {
            userName: user.userName,
            avatar: `https://api.adorable.io/avatars/150/${random}`,
            email: user.email,
            userId,
          };
          this.createUser(this.user);
        });
  }

  createUser(user: User) {
    this.spinner.show();
    this.userService.createUser(user)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(response => {
        console.log(response);
        this.registeredEnd();
      },
        () => {
          this.spinner.hide();
          this.toastr.error('Sorry, something went wrong, try again later');
        });
  }

  registeredEnd() {
    this.router.navigate(['/dashboard']);
    this.toastr.success('You have been registered successfully');
    this.spinner.hide();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
