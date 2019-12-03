import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MustMatch } from '../shared/must-match.validator';
import { User } from '../shared/interfaces';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  user: User;

  constructor(
    private authService: AuthService,
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
    this.authService.getGitHubInfo(user.userName)
      .pipe()
      .subscribe(
        (gitHubUserInfo) => {
          if (gitHubUserInfo) {
            this.user = {
              userName: gitHubUserInfo.name,
              avatar: gitHubUserInfo.avatar_url,
              email: user.email,
              password: user.password,
              userId,
            };
          }
          this.registeredEnd();
        },
        (error) => {
          this.user = {
            userName: user.userName,
            avatar: 'https://api.adorable.io/avatars/150/abott@adorable.png',
            email: user.email,
            password: user.password,
            userId,
          };
          this.registeredEnd();
        });
  }

  registeredEnd() {
    this.router.navigate(['/dashboard']);
    this.toastr.success('You have been registered successfully');
    this.spinner.hide();
    console.log(this.user);
  }
}
