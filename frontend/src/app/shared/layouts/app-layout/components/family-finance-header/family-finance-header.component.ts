import { Component, ElementRef, HostListener, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../../../../constants/app-routes';
import { AuthSessionService } from '../../../../../features/auth/services/auth-session.service';
import { AppLogoComponent } from '../../../../../features/home/components/app-logo/app-logo.component';

@Component({
  selector: 'app-family-finance-header',
  imports: [RouterLink, AppLogoComponent],
  templateUrl: './family-finance-header.component.html'
})
export class FamilyFinanceHeaderComponent {
  readonly routeLinks = APP_ROUTE_LINKS;
  readonly familyName = computed(() => this.authSessionService.currentUser()?.familyName ?? 'Family');
  readonly familyInitials = computed(() => toFamilyInitials(this.familyName()));
  readonly isAccountMenuOpen = signal(false);

  constructor(
    private readonly authSessionService: AuthSessionService,
    private readonly router: Router,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  toggleAccountMenu(): void {
    this.isAccountMenuOpen.update((currentValue) => !currentValue);
  }

  closeAccountMenu(): void {
    this.isAccountMenuOpen.set(false);
  }

  signOut(): void {
    this.authSessionService.signOut();
    this.closeAccountMenu();
    void this.router.navigateByUrl(this.routeLinks.SIGN_IN);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isAccountMenuOpen()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      this.closeAccountMenu();
      return;
    }

    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeAccountMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.closeAccountMenu();
  }
}

function toFamilyInitials(familyName: string): string {
  const trimmed = familyName.trim();
  if (!trimmed) {
    return 'FA';
  }

  const letters = trimmed.replace(/[^A-Za-z]/g, '').toUpperCase();
  if (letters.length >= 2) {
    return letters.slice(0, 2);
  }

  return (letters + 'A').slice(0, 2);
}
