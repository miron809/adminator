import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Email } from '../shared/interfaces';
import { EmailService } from '../shared/services/email.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compose-page',
  templateUrl: './compose-page.component.html',
  styleUrls: ['./compose-page.component.scss']
})
export class ComposePageComponent implements OnInit {

  form: FormGroup;

  constructor(
    private emailService: EmailService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.buildForm();
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
}
