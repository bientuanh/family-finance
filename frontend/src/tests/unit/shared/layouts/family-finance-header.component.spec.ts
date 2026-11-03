import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { APP_ROUTE_LINKS } from '../../../../app/constants/app-routes';
import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { FamilyFinanceHeaderComponent } from '../../../../app/shared/layouts/app-layout/components/family-finance-header/family-finance-header.component';

describe('FamilyFinanceHeaderComponent', () => {
  const authSession = {
    currentUser: vi.fn(() => ({
      userId: 1,
      familyName: 'Green Family',
      email: 'family@example.com'
    })),
    isAuthenticated: vi.fn(() => true),
    signOut: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyFinanceHeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthSessionService, useValue: authSession }
      ]
    }).compileComponents();
  });

  it('FamilyFinanceHeader_handlesAccountMenuActionsAndInitials', async () => {
    authSession.signOut.mockClear();
    const router = TestBed.inject(Router);
    const navigateSpy = vi
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);
    const scrollTargets: object[] = [
      window,
      document.documentElement,
      document.body
    ];
    const scrollDescriptors = scrollTargets.map((target) =>
      Object.getOwnPropertyDescriptor(target, 'scrollTo')
    );
    const scroll = vi.fn();
    scrollTargets.forEach((target) =>
      Object.defineProperty(target, 'scrollTo', {
        configurable: true,
        value: scroll
      })
    );
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const fixture = TestBed.createComponent(FamilyFinanceHeaderComponent);
    try {
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector('.account-trigger');

      expect(fixture.nativeElement.querySelector('.avatar').textContent.trim()).toBe('GR');
      trigger.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="menu"]')).not.toBeNull();

      document.body.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();

      trigger.click();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' })
      );
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();

      trigger.click();
      fixture.componentInstance.onDocumentClick(new MouseEvent('click'));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();

      trigger.click();
      fixture.detectChanges();
      fixture.nativeElement
        .querySelector('.account-dropdown__item-signout')
        .click();
      fixture.detectChanges();

      expect(authSession.signOut).toHaveBeenCalledOnce();
      expect(navigateSpy).toHaveBeenCalledWith(APP_ROUTE_LINKS.SIGN_IN);
      expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();

      const brandLink = fixture.nativeElement.querySelector('.brand');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      brandLink.dispatchEvent(clickEvent);
      await Promise.resolve();

      expect(clickEvent.defaultPrevented).toBe(true);
      expect(navigateSpy).toHaveBeenCalledWith(APP_ROUTE_LINKS.LANDING);
      expect(scroll).toHaveBeenCalledTimes(3);

      fixture.destroy();
      authSession.currentUser.mockReturnValue({
        userId: 1,
        familyName: '',
        email: 'family@example.com'
      });
      const emptyNameFixture = TestBed.createComponent(FamilyFinanceHeaderComponent);
      emptyNameFixture.detectChanges();
      expect(emptyNameFixture.nativeElement.querySelector('.avatar').textContent.trim()).toBe('FA');

      emptyNameFixture.destroy();
      authSession.currentUser.mockReturnValue({
        userId: 1,
        familyName: 'A',
        email: 'family@example.com'
      });
      const shortNameFixture = TestBed.createComponent(FamilyFinanceHeaderComponent);
      shortNameFixture.detectChanges();
      expect(shortNameFixture.nativeElement.querySelector('.avatar').textContent.trim()).toBe('AA');
      shortNameFixture.destroy();
    } finally {
      vi.unstubAllGlobals();
      scrollTargets.forEach((target, index) => {
        const descriptor = scrollDescriptors[index];
        if (descriptor) {
          Object.defineProperty(target, 'scrollTo', descriptor);
        } else {
          Reflect.deleteProperty(target, 'scrollTo');
        }
      });
    }
  });
});
