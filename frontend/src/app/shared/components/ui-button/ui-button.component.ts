import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

type ButtonVariant = 'primary' | 'secondary' | 'link';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-ui-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './ui-button.component.html'
})
export class UiButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly danger = input(false);
  readonly routerLink = input<string | readonly unknown[] | null>(null);
  readonly href = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  buttonClass(): string {
    const classes = ['btn', `btn-${this.variant()}`];
    if (this.variant() === 'link' && this.danger()) {
      classes.push('danger');
    }

    return classes.join(' ');
  }
}
