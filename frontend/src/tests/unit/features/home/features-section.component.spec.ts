import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { FeaturesSectionComponent } from '../../../../app/features/home/sections/features-section/features-section.component';

describe('FeaturesSectionComponent', () => {
  it('FeaturesSection_rendersFeatureCards', async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesSectionComponent]
    }).compileComponents();
    const fixture = TestBed.createComponent(FeaturesSectionComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.home-feature-card')).toHaveLength(3);
  });
});
