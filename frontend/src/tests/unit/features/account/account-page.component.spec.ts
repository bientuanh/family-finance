import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { AccountPageComponent } from '../../../../app/features/account/pages/account-page/account-page.component';

describe('AccountPageComponent', () => {
  it('AccountPage_rendersCurrentFamilyAccountDetails', async () => {
    await TestBed.configureTestingModule({
      imports: [AccountPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthSessionService,
          useValue: {
            currentUser: vi.fn(() => ({
              userId: 7,
              familyName: 'Tran Family',
              email: 'family@example.com'
            })),
            isAuthenticated: vi.fn(() => true),
            signOut: vi.fn()
          }
        }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(AccountPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Tran Family');
    expect(fixture.nativeElement.textContent).toContain('family@example.com');
    expect(fixture.nativeElement.textContent).toContain('7');
  });
});
