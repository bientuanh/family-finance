import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { UiPageComponent } from '../../../../app/shared/components/ui-page/ui-page.component';

describe('UiPageComponent', () => {
  it('UiPage_appliesClassesForEverySupportedVariant', async () => {
    await TestBed.configureTestingModule({
      imports: [UiPageComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(UiPageComponent);
    const variants = [
      ['default', 'page'],
      ['fluid', 'page page-fluid'],
      ['reading', 'page page-reading'],
      ['form', 'page form-page'],
      ['compact-form', 'page form-page form-page--compact']
    ] as const;
    const classes: string[] = [];

    for (const [variant] of variants) {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();
      classes.push(fixture.nativeElement.querySelector('div').className);
    }

    expect(classes).toEqual(variants.map(([, className]) => className));
  });
});
