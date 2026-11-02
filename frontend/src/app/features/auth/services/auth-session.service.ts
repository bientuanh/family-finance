import { Injectable, signal } from '@angular/core';

interface AuthSessionUser {
  userId: number;
  familyName: string;
  email: string;
}

const STORAGE_KEY = 'family-finance-auth-session';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly userState = signal<AuthSessionUser | null>(this.readStoredUser());

  currentUser(): AuthSessionUser | null {
    return this.userState();
  }

  isAuthenticated(): boolean {
    return this.userState() !== null;
  }

  signIn(user: AuthSessionUser): void {
    this.userState.set(user);
    this.writeStoredUser(user);
  }

  signOut(): void {
    this.userState.set(null);
    this.removeStoredUser();
  }

  private readStoredUser(): AuthSessionUser | null {
    try {
      const serialized = globalThis.localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        return null;
      }

      const parsed = JSON.parse(serialized) as Partial<AuthSessionUser>;
      if (
        typeof parsed.userId === 'number' &&
        Number.isInteger(parsed.userId) &&
        parsed.userId > 0 &&
        typeof parsed.familyName === 'string' &&
        parsed.familyName.length > 0 &&
        typeof parsed.email === 'string' &&
        parsed.email.length > 0
      ) {
        return {
          userId: parsed.userId,
          familyName: parsed.familyName,
          email: parsed.email
        };
      }

      this.removeStoredUser();
      return null;
    } catch (error) {
      console.error('Unable to read saved authentication session.', error);
      this.removeStoredUser();
      return null;
    }
  }

  private writeStoredUser(user: AuthSessionUser): void {
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Unable to persist authentication session.', error);
    }
  }

  private removeStoredUser(): void {
    try {
      globalThis.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Unable to clear authentication session.', error);
    }
  }
}
