import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { FamilyFinanceSidebarComponent } from '../../../../app/shared/layouts/app-layout/components/family-finance-sidebar/family-finance-sidebar.component';

describe('FamilyFinanceSidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyFinanceSidebarComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('FamilyFinanceSidebar_marksActiveLinkAndEmitsSelection', () => {
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(FamilyFinanceSidebarComponent);
    const selected = vi.fn();
    fixture.componentRef.setInput('activeItem', 'planning');
    fixture.componentInstance.navItemSelected.subscribe(selected);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.nav-item')).toHaveLength(3);
    expect(
      fixture.nativeElement.querySelector('.nav-item.active').textContent.trim()
    ).toBe('Planning');

    fixture.nativeElement.querySelector('.nav-item[href="/app"]').click();

    expect(selected).toHaveBeenCalledOnce();
  });
});
