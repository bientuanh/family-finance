import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { AppLogoComponent } from '../../../../app/features/home/components/app-logo/app-logo.component';

describe('AppLogoComponent', () => {
  it('AppLogo_compactMode_hidesTextAndAppliesCompactClass', async () => {
    await TestBed.configureTestingModule({
      imports: [AppLogoComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(AppLogoComponent);

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Family Finance');

    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.home-logo--compact')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Budget Planner');
  });
});
