import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  inject,
  input
} from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]'
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private revealFrameId: number | null = null;
  private revealTimeoutId: number | null = null;
  private observerArmTimeoutId: number | null = null;

  readonly appRevealOnScrollDelay = input(0);
  readonly appRevealOnScrollOnce = input(true);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.renderer.addClass(this.elementRef.nativeElement, 'reveal-on-scroll-visible');
      return;
    }

    const hostElement = this.elementRef.nativeElement;
    this.renderer.addClass(hostElement, 'reveal-on-scroll');
    this.renderer.setStyle(hostElement, 'transitionDelay', `${this.appRevealOnScrollDelay()}ms`);
    this.observerArmTimeoutId = window.setTimeout(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              if (this.revealTimeoutId !== null) {
                window.clearTimeout(this.revealTimeoutId);
                this.revealTimeoutId = null;
              }

              if (!this.appRevealOnScrollOnce()) {
                this.renderer.removeClass(hostElement, 'reveal-on-scroll-visible');
              }
              continue;
            }

            if (this.revealTimeoutId !== null) {
              window.clearTimeout(this.revealTimeoutId);
            }

            this.revealTimeoutId = window.setTimeout(() => {
              this.revealFrameId = window.requestAnimationFrame(() => {
                this.renderer.removeClass(hostElement, 'reveal-on-scroll-visible');
                hostElement.getBoundingClientRect();
                this.renderer.addClass(hostElement, 'reveal-on-scroll-visible');
                this.revealFrameId = null;
              });
              this.revealTimeoutId = null;
            }, 60);

            if (this.appRevealOnScrollOnce()) {
              this.observer?.unobserve(hostElement);
            }
          }
        },
        { threshold: 0.12 }
      );

      this.observer.observe(hostElement);
      this.observerArmTimeoutId = null;
    }, 120);
  }

  ngOnDestroy(): void {
    if (this.observerArmTimeoutId !== null) {
      window.clearTimeout(this.observerArmTimeoutId);
      this.observerArmTimeoutId = null;
    }
    if (this.revealFrameId !== null) {
      window.cancelAnimationFrame(this.revealFrameId);
      this.revealFrameId = null;
    }
    if (this.revealTimeoutId !== null) {
      window.clearTimeout(this.revealTimeoutId);
      this.revealTimeoutId = null;
    }
    this.observer?.disconnect();
    this.observer = null;
  }
}
