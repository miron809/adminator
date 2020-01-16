import { Pipe, PipeTransform } from '@angular/core';
import { Email } from '../../../shared/interfaces';

@Pipe({
  name: 'searchEmails'
})

export class SearchPipe implements PipeTransform {
  transform(emails: Email[], search = ''): Email[] {
    if (!search.trim()) {
      return emails;
    }

    return emails.filter( email => {
      return (
        email.subject.toLowerCase().includes(search.toLowerCase()) ||
        email.fromName.toLowerCase().includes(search.toLowerCase()) ||
        email.text.toLowerCase().includes(search.toLowerCase())
      );
    });
  }
}
