import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.toastr.warning('Please, log in again');
      } else if (params['authFailed']) {
        this.toastr.warning('Your session is expired, please re-enter your credentials');
      }
    });
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup({
      email: new FormControl('admin@email.com', [Validators.required, Validators.email]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.spinner.show();

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    };

    this.authService.login(user)
      .subscribe(() => {
        this.form.reset();
        this.router.navigate(['/dashboard']);
        this.submitted = false;
        this.spinner.hide();
      }, () => {
        this.submitted = false;
        this.spinner.hide();
        }
      );
  }
}
