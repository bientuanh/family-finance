import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';

const storageKey = 'family-finance-auth-session';

describe('AuthSessionService', () => {
  beforeEach(() => {
    localStorage.removeItem(storageKey);
  });

  afterEach(() => {
    localStorage.removeItem(storageKey);
  });

  it('AuthSession_signInAndSignOut_persistsAndClearsUser', () => {
    const service = TestBed.inject(AuthSessionService);
    const user = { userId: 5, familyName: 'Tran Family', email: 'family@example.com' };

    service.signIn(user);

    expect(service.currentUser()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify(user));

    service.signOut();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it('AuthSession_withInvalidStoredUser_discardsTheSession', () => {
    localStorage.setItem(storageKey, JSON.stringify({ userId: 0, familyName: 'Family', email: 'family@example.com' }));

    const service = TestBed.inject(AuthSessionService);

    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it('AuthSession_withValidStoredUser_restoresTheSession', () => {
    const user = { userId: 12, familyName: 'Family', email: 'family@example.com' };
    localStorage.setItem(storageKey, JSON.stringify(user));

    const service = TestBed.inject(AuthSessionService);

    expect(service.currentUser()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
  });
});
