import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RevealOnScrollDirective } from '../../../../app/shared/directives/reveal-on-scroll.directive';

@Component({
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <div
      [appRevealOnScrollDelay]="delay"
      [appRevealOnScrollOnce]="once"
      appRevealOnScroll
    ></div>
  `
})
class RevealOnScrollTestHostComponent {
  delay = 0;
  once = true;
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
  readonly observe = vi.fn((_target: Element) => undefined);
  readonly unobserve = vi.fn((_target: Element) => undefined);
  readonly disconnect = vi.fn();

  constructor(private readonly callback: IntersectionObserverCallback) {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(target: Element, isIntersecting: boolean): void {
    const rect = target.getBoundingClientRect();
    this.callback(
      [
        {
          boundingClientRect: rect,
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: rect,
          isIntersecting,
          rootBounds: null,
          target,
          time: 0
        }
      ],
      this
    );
  }
}

describe('RevealOnScrollDirective', () => {
  let observer: MockIntersectionObserver | null;
  let cancelFrame: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observer = null;
    vi.useFakeTimers();
    vi.stubGlobal(
      'IntersectionObserver',
      class extends MockIntersectionObserver {
        constructor(callback: IntersectionObserverCallback) {
          super(callback);
          observer = this;
        }
      }
    );
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(0), 16)
    );
    cancelFrame = vi.fn((frameId: number) => window.clearTimeout(frameId));
    vi.stubGlobal('cancelAnimationFrame', cancelFrame);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  async function createFixture(platformId = 'browser', once = true, delay = 0) {
    await TestBed.configureTestingModule({
      imports: [RevealOnScrollTestHostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: platformId }]
    }).compileComponents();

    const fixture = TestBed.createComponent(RevealOnScrollTestHostComponent);
    fixture.componentInstance.once = once;
    fixture.componentInstance.delay = delay;
    fixture.detectChanges();
    return fixture;
  }

  it('RevealOnScroll_handlesServerAndRepeatedBrowserVisibility', async () => {
    const serverFixture = await createFixture('server');

    expect(
      serverFixture.nativeElement
        .querySelector('div')
        .classList.contains('reveal-on-scroll-visible')
    ).toBe(true);
    expect(observer).toBeNull();
    serverFixture.destroy();
    TestBed.resetTestingModule();

    const fixture = await createFixture('browser', false, 250);
    const host = fixture.nativeElement.querySelector('div') as HTMLElement;

    expect(host.style.transitionDelay).toBe('250ms');
    vi.advanceTimersByTime(120);
    expect(observer?.observe).toHaveBeenCalledWith(host);

    observer?.trigger(host, true);
    vi.advanceTimersByTime(60);
    vi.advanceTimersByTime(16);
    expect(host.classList.contains('reveal-on-scroll-visible')).toBe(true);

    observer?.trigger(host, false);
    expect(host.classList.contains('reveal-on-scroll-visible')).toBe(false);

    fixture.destroy();
    TestBed.resetTestingModule();
    cancelFrame.mockClear();
    const onceFixture = await createFixture();
    const onceHost = onceFixture.nativeElement.querySelector('div') as HTMLElement;
    vi.advanceTimersByTime(120);

    observer?.trigger(onceHost, true);
    expect(observer?.unobserve).toHaveBeenCalledWith(onceHost);

    vi.advanceTimersByTime(60);
    onceFixture.destroy();

    expect(observer?.disconnect).toHaveBeenCalledOnce();
    expect(cancelFrame).toHaveBeenCalled();
  });
});
