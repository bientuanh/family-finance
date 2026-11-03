import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { HomePageComponent } from '../../../../app/features/home/pages/home-page/home-page.component';

describe('HomePageComponent', () => {
  it('HomePage_rendersAllLandingSections', async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthSessionService,
          useValue: {
            currentUser: vi.fn(() => null),
            isAuthenticated: vi.fn(() => false),
            signOut: vi.fn()
          }
        }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-hero-banner-section')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-features-section')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-faq-section')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-about-me-section')).not.toBeNull();
  });
});
