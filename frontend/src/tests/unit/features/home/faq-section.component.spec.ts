import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { FaqSectionComponent } from '../../../../app/features/home/sections/faq-section/faq-section.component';

describe('FaqSectionComponent', () => {
  it('FaqSection_rendersAllQuestions', async () => {
    await TestBed.configureTestingModule({
      imports: [FaqSectionComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(FaqSectionComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('details')).toHaveLength(6);
  });
});
