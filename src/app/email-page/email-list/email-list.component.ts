import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Email } from '../../shared/interfaces';
import { EmailService } from '../../shared/services/email.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit {

  @Output() onclick: EventEmitter<Email> = new EventEmitter<Email>();

  searchStr = '';
  public emails: Email[] = [];
  public hightlightStatus = [];

  constructor(
    private emailService: EmailService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.getEmails();
  }

  getEmails() {
    this.spinner.show();
    this.emailService.getEmails()
      .subscribe(emails => {
          this.emails = Object.values(emails);
          this.emails.sort((a: any, b: any) => {
            return (Date.parse(b.date) - Date.parse(a.date));
          });
          this.spinner.hide();
        },
        () => this.spinner.hide());
  }

  focusEmail(email, i) {
    this.onclick.emit(email);
    this.hightlightStatus = [];
    this.hightlightStatus[i] = true;
  }

}
