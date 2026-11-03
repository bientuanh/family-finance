import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { AuthSessionService } from '../../../../app/features/auth/services/auth-session.service';
import { HomeLayoutComponent } from '../../../../app/shared/layouts/home-layout/home-layout.component';

@Component({
  standalone: true,
  imports: [HomeLayoutComponent],
  template: `
    <app-home-layout>
      <p class="projected-content">Projected page content</p>
    </app-home-layout>
  `
})
class HomeLayoutTestHostComponent {}

describe('HomeLayoutComponent', () => {
  it('HomeLayout_rendersHeaderFooterAndProjectedContent', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLayoutTestHostComponent],
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
    const fixture = TestBed.createComponent(HomeLayoutTestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('main.home-page')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-home-header')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-home-footer')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('.projected-content').textContent.trim()
    ).toBe('Projected page content');
  });
});
