import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Email } from '../../shared/interfaces';
import { EmailService } from '../../shared/services/email.service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit {

  @Output() onclick: EventEmitter<Email> = new EventEmitter<Email>();

  public emails: Email[] = [];
  public hightlightStatus = [];

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
    this.onclick.emit(email);
    this.hightlightStatus = [];
    this.hightlightStatus[i] = true;
  }

}
