import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Email } from '../../shared/interfaces';
import { EmailService } from '../../shared/services/email.service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit {

  @Output() onClick: EventEmitter<Email> = new EventEmitter<Email>();

  public emails: Email[] = [];

  constructor(
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.getEmails();
  }

  getEmails() {
    this.emailService.getEmails()
      .subscribe(emails => {
        this.emails = Object.values(emails);
      });
  }

  focusEmail(email, i) {
    this.onClick.emit(email);
  }

}
