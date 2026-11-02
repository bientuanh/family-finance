import { Component, input } from '@angular/core';

@Component({
  selector: 'app-home-logo',
  templateUrl: './app-logo.component.html'
})
export class AppLogoComponent {
  readonly compact = input(false);
}
