import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';

import { UiButtonComponent } from '../../../../app/shared/components/ui-button/ui-button.component';

describe('UiButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('UiButton_rendersInternalNavigationWithLinkStyling', () => {
    const fixture = TestBed.createComponent(UiButtonComponent);
    fixture.componentRef.setInput('routerLink', '/home');
    fixture.componentRef.setInput('variant', 'link');
    fixture.componentRef.setInput('danger', true);
    fixture.componentRef.setInput('ariaLabel', 'Go home');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');

    expect(link.getAttribute('href')).toBe('/home');
    expect(link.className).toBe('btn btn-link danger');
    expect(link.getAttribute('aria-label')).toBe('Go home');
  });

  it('UiButton_rendersExternalLinksAndDisabledNativeButtons', () => {
    const fixture = TestBed.createComponent(UiButtonComponent);
    fixture.componentRef.setInput('href', 'https://example.com');
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.className).toBe('btn btn-secondary');

    fixture.componentRef.setInput('href', null);
    fixture.componentRef.setInput('type', 'submit');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('type')).toBe('submit');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.className).toBe('btn btn-secondary');
  });
});
