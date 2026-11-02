import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  templateUrl: './ui-card.component.html'
})
export class UiCardComponent {
  readonly className = input<string>('');
}
