import { Component } from '@angular/core';

import { HomeFooterComponent } from './components/home-footer/home-footer.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';

@Component({
  selector: 'app-home-layout',
  imports: [HomeHeaderComponent, HomeFooterComponent],
  templateUrl: './home-layout.component.html'
})
export class HomeLayoutComponent {}
