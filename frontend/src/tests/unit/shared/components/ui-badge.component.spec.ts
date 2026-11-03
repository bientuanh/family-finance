import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { UiBadgeComponent } from '../../../../app/shared/components/ui-badge/ui-badge.component';

describe('UiBadgeComponent', () => {
  it('UiBadge_rendersTypeSkillsAndStatusVariants', async () => {
    await TestBed.configureTestingModule({
      imports: [UiBadgeComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(UiBadgeComponent);

    fixture.componentRef.setInput('text', 'Employee');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.badge-type').textContent.trim()
    ).toBe('Employee');

    fixture.componentRef.setInput('variant', 'skills');
    fixture.componentRef.setInput('text', 'Angular');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.badge-skills').textContent.trim()
    ).toBe('Angular');

    fixture.componentRef.setInput('variant', 'status');
    fixture.componentRef.setInput('status', 'on-leave');
    fixture.componentRef.setInput('text', 'Away');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.status-badge.on-leave').textContent
        .trim()
    ).toBe('Away');
  });
});
