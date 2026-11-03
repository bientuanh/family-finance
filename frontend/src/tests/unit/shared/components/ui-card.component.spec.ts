import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { UiCardComponent } from '../../../../app/shared/components/ui-card/ui-card.component';

describe('UiCardComponent', () => {
  it('UiCard_appliesAdditionalClassToCardSection', async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(UiCardComponent);
    fixture.componentRef.setInput('className', 'custom-card');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('section.card.custom-card')
    ).not.toBeNull();
  });
});
