import { Component } from '@angular/core';
import { AboutMeSectionComponent } from '../../sections/about-me-section/about-me-section.component';
import { FaqSectionComponent } from '../../sections/faq-section/faq-section.component';
import { FeaturesSectionComponent } from '../../sections/features-section/features-section.component';
import { HeroBannerSectionComponent } from '../../sections/hero-banner-section/hero-banner-section.component';
import { HomeLayoutComponent } from '../../../../shared/layouts/home-layout/home-layout.component';
import { CalloutSectionComponent } from '../../sections/callout-section/callout-section.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-home-page',
  imports: [
    HomeLayoutComponent,
    HeroBannerSectionComponent,
    FeaturesSectionComponent,
    CalloutSectionComponent,
    FaqSectionComponent,
    AboutMeSectionComponent,
    RevealOnScrollDirective
  ],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {}
