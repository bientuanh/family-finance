import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { AboutMeSectionComponent } from '../../../../app/features/home/sections/about-me-section/about-me-section.component';

describe('AboutMeSectionComponent', () => {
  it('AboutMeSection_rendersHeadingAndDescription', async () => {
    await TestBed.configureTestingModule({
      imports: [AboutMeSectionComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(AboutMeSectionComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent.trim()).toBe('About me');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('help families plan income');
  });
});
