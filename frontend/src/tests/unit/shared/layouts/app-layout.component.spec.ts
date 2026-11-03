import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { AppLayoutComponent } from '../../../../app/shared/layouts/app-layout/app-layout.component';

describe('AppLayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLayoutComponent],
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
  });

  it('AppLayout_togglesSidebarAndClosesItAfterNavigation', () => {
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(AppLayoutComponent);
    fixture.componentRef.setInput('activeItem', 'planning');
    fixture.componentRef.setInput('pageClass', 'planning-page');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('main.planning-page')
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('.nav-item.active').textContent.trim()
    ).toBe('Planning');

    fixture.nativeElement.querySelector('.sidebar-toggle').click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.sidebar-toggle').getAttribute('aria-expanded')
    ).toBe('true');
    expect(fixture.nativeElement.querySelector('.sidebar-backdrop')).not.toBeNull();

    fixture.nativeElement
      .querySelector('.nav-item[href="/app/expenses/new"]')
      .click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.sidebar-toggle').getAttribute('aria-expanded')
    ).toBe('false');
    expect(fixture.nativeElement.querySelector('.sidebar-backdrop')).toBeNull();
  });
});
