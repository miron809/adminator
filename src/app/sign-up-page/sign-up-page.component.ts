import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MustMatch } from '../shared/must-match.validator';
import { User } from '../shared/interfaces';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

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
    private toastr: ToastrService) {
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

    const user: User = {
      userName: this.form.value.userName,
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    };

    forkJoin([
      this.authService.signUp(user),
      this.authService.getGitHubInfo(user.userName)
  ]).subscribe(([signUp, getGitHubInfo]) => {
      if (signUp) {
        this.form.reset();
        this.router.navigate(['/dashboard']);
        this.toastr.success('You have been registered successfully');
        this.submitted = false;
      }
      if (getGitHubInfo) {
        this.user = {
          userName: getGitHubInfo.name,
          avatar: getGitHubInfo.avatar_url,
          email: user.email,
          password: user.password,
          userId: signUp.localId,
        };
        console.log(this.user);
      }
    },
      () => {
        this.submitted = false;
      });

    // this.authService.signUp(user)
    //   .subscribe((resp) => {
    //       this.form.reset();
    //       this.router.navigate(['/dashboard']);
    //       this.toastr.success('You have been registered successfully');
    //       this.submitted = false;
    //     }, () => {
    //       this.submitted = false;
    //     }
    //   );
  }
}
