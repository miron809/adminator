import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Email, User } from '../../shared/interfaces';
import { from, Subject } from 'rxjs';
import { EmailService } from '../../shared/services/email.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit, OnDestroy {

  form: FormGroup;
  user: User;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private emailService: EmailService,
    private toastr: ToastrService,
    private userService: UserService,
    private authService: AuthService) { }

  ngOnInit() {
    this.buildForm();
    this.getUserById();
  }

  getUserById() {
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
        },
        (error) => {
          this.toastr.error(error.statusText);
        }
      );
  }

  buildForm(): void {
    this.form = new FormGroup({
      emailTo: new FormControl(null, [Validators.required, Validators.email]),
      emailSubject: new FormControl(null, [Validators.required]),
      emailText: new FormControl(null)
    });
  }

  sendEmail({value, valid}: {value: any, valid: boolean} ) {
    if (valid) {
      const email: Email = {
        fromName: this.user.displayName,
        fromEmail: this.user.email,
        date: new Date(),
        avatar: this.user.photoUrl,
        to: value.emailTo,
        subject: value.emailSubject,
        text: value.emailText
      };
      this.emailService.sendEmail(email)
        .subscribe((response) => {
            if (response) {
              this.toastr.success('Your message has been sent successfully');
              this.form.reset();
            }
          },
          (error) => {
            this.toastr.error(error.statusText);
          });
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
