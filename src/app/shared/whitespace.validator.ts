import { AbstractControl } from '@angular/forms';

export function WhitespaceValidator(control: AbstractControl) {
  const isInValid = (control.value || '').trim().length === 0;
  return isInValid ? { whitespace: 'value is only whitespace' } : null;
}
