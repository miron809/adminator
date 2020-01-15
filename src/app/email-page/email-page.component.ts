import { Component, Input, OnInit } from '@angular/core';
import { EmailService } from '../shared/services/email.service';
import { map } from 'rxjs/operators';
import { isArray } from 'util';
import { Email } from '../shared/interfaces';

@Component({
  selector: 'app-email-page',
  templateUrl: './email-page.component.html',
  styleUrls: ['./email-page.component.scss']
})
export class EmailPageComponent implements OnInit {
  email: Email;

  constructor() { }

  ngOnInit() {

  }

  showEmail(email: Email) {
    this.email = email;
  }

}
