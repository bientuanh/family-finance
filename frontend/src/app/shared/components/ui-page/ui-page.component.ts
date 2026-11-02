import { Component, input } from '@angular/core';

type PageVariant = 'default' | 'fluid' | 'reading' | 'form' | 'compact-form';

@Component({
  selector: 'app-ui-page',
  templateUrl: './ui-page.component.html'
})
export class UiPageComponent {
  readonly variant = input<PageVariant>('default');

  pageClass(): string {
    const classMap: Record<PageVariant, string> = {
      default: 'page',
      fluid: 'page page-fluid',
      reading: 'page page-reading',
      form: 'page form-page',
      'compact-form': 'page form-page form-page--compact'
    };

    return classMap[this.variant()];
  }
}
