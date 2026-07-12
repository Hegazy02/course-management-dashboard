import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  template: `
    @if (message; as validationMessage) {
      <small class="text-sm text-red-500">{{ validationMessage }}</small>
    }
  `,
})
export class FormErrorComponent {
  readonly control = input.required<AbstractControl>();
  readonly messages = input<Record<string, string>>({});

  get message(): string | null {
    const control = this.control();

    if (!control.invalid || !control.touched) {
      return null;
    }

    const errorKey = Object.keys(control.errors ?? {})[0];

    return errorKey ? (this.messages()[errorKey] ?? 'This field is invalid.') : null;
  }
}
