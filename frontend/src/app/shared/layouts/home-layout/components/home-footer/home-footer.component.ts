import { Component } from '@angular/core';

import { AppLogoComponent } from '../../../../../features/home/components/app-logo/app-logo.component';

@Component({
  selector: 'app-home-footer',
  imports: [AppLogoComponent],
  templateUrl: './home-footer.component.html'
})
export class HomeFooterComponent {
  readonly year = new Date().getFullYear();
}
