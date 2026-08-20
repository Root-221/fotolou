import { Injectable, signal, computed, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export type PwaPlatform = 'ios' | 'android' | 'desktop' | 'other';

@Injectable({
  providedIn: 'root'
})
export class PwaService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly STORAGE_KEY = 'fotolou_pwa_dismissed_at';
  private readonly SNOOZE_DAYS = 7;

  // ── Reactive State ──────────────────────────────────────────
  readonly isStandalone = signal<boolean>(false);
  readonly platform = signal<PwaPlatform>('other');
  readonly isMobile = signal<boolean>(false);
  readonly canPromptNative = signal<boolean>(false);
  readonly showBanner = signal<boolean>(false);
  readonly showGuideModal = signal<boolean>(false);

  // ── Derived State ───────────────────────────────────────────
  readonly isInstalled = computed(() => this.isStandalone());
  readonly isIos = computed(() => this.platform() === 'ios');
  readonly isAndroid = computed(() => this.platform() === 'android');

  // Can be installed or guided
  readonly isInstallable = computed(() => {
    if (this.isStandalone()) return false;
    return this.canPromptNative() || this.isIos() || this.isAndroid() || this.isMobile();
  });

  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private standaloneMediaQueryList: MediaQueryList | null = null;
  private autoShowTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (!this.isBrowser) return;

    this.detectPlatform();
    this.detectStandaloneMode();
    this.setupListeners();
    this.checkInitialPrompt();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.cleanupListeners();
  }

  // ── Platform Detection ──────────────────────────────────────
  private detectPlatform(): void {
    if (!this.isBrowser) return;

    const ua = navigator.userAgent || navigator.vendor || '';
    const platform = (navigator as unknown as { userAgentData?: { platform?: string }; platform?: string }).platform || '';

    // iOS Detection (iPhone, iPad, iPod, including iPadOS with desktop UA)
    const isIosDevice =
      /iphone|ipad|ipod/i.test(ua) ||
      (platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Android Detection
    const isAndroidDevice = /android/i.test(ua);

    // Mobile check
    const isMobileDevice =
      isIosDevice ||
      isAndroidDevice ||
      /mobile|touch|tablet|silk|kindle/i.test(ua) ||
      (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);

    if (isIosDevice) {
      this.platform.set('ios');
    } else if (isAndroidDevice) {
      this.platform.set('android');
    } else if (!isMobileDevice) {
      this.platform.set('desktop');
    } else {
      this.platform.set('other');
    }

    this.isMobile.set(isMobileDevice);
  }

  // ── Standalone Mode Detection ───────────────────────────────
  private detectStandaloneMode(): void {
    if (!this.isBrowser) return;

    // Check display-mode: standalone
    const isMediaStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
    const isMediaFullscreen = window.matchMedia?.('(display-mode: fullscreen)').matches ?? false;
    const isMediaMinimal = window.matchMedia?.('(display-mode: minimal-ui)').matches ?? false;
    const isMediaOverlay = window.matchMedia?.('(display-mode: window-controls-overlay)').matches ?? false;

    // Check iOS Safari standalone property
    const isIosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;

    // Check android-app referrer or query parameter
    const isReferrerPwa = document.referrer?.startsWith('android-app://') ?? false;
    const isUrlPwa = window.location.search.includes('source=pwa');

    const standalone =
      isMediaStandalone ||
      isMediaFullscreen ||
      isMediaMinimal ||
      isMediaOverlay ||
      isIosStandalone ||
      isReferrerPwa ||
      isUrlPwa;

    this.isStandalone.set(standalone);

    // Watch for standalone changes
    if (window.matchMedia) {
      this.standaloneMediaQueryList = window.matchMedia('(display-mode: standalone)');
      this.standaloneMediaQueryList.addEventListener('change', this.onDisplayModeChange);
    }
  }

  private readonly onDisplayModeChange = (e: MediaQueryListEvent): void => {
    if (e.matches) {
      this.isStandalone.set(true);
      this.showBanner.set(false);
      this.showGuideModal.set(false);
    }
  };

  // ── Event Listeners ─────────────────────────────────────────
  private setupListeners(): void {
    window.addEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
    window.addEventListener('appinstalled', this.onAppInstalled);
  }

  private cleanupListeners(): void {
    window.removeEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.onAppInstalled);
    if (this.standaloneMediaQueryList) {
      this.standaloneMediaQueryList.removeEventListener('change', this.onDisplayModeChange);
    }
    if (this.autoShowTimer) {
      clearTimeout(this.autoShowTimer);
    }
  }

  private readonly onBeforeInstallPrompt = (event: Event): void => {
    // Prevent the default mini-infobar or browser prompt
    event.preventDefault();
    this.deferredPrompt = event as BeforeInstallPromptEvent;
    this.canPromptNative.set(true);

    this.evaluateBannerVisibility();
  };

  private readonly onAppInstalled = (): void => {
    this.isStandalone.set(true);
    this.canPromptNative.set(false);
    this.deferredPrompt = null;
    this.showBanner.set(false);
    this.showGuideModal.set(false);
  };

  // ── Prompt Scheduling & Snooze ──────────────────────────────
  private checkInitialPrompt(): void {
    // For iOS or other platforms where beforeinstallprompt doesn't fire,
    // evaluate visibility after a short delay so page loads smoothly.
    this.autoShowTimer = setTimeout(() => {
      this.evaluateBannerVisibility();
    }, 2500);
  }

  private evaluateBannerVisibility(): void {
    if (this.isStandalone()) {
      this.showBanner.set(false);
      return;
    }

    if (this.isDismissedRecently()) {
      this.showBanner.set(false);
      return;
    }

    // Display banner on mobile browsers if not standalone
    if (this.isMobile() || this.canPromptNative()) {
      this.showBanner.set(true);
    }
  }

  private isDismissedRecently(): boolean {
    if (!this.isBrowser) return false;
    const dismissedAt = localStorage.getItem(this.STORAGE_KEY);
    if (!dismissedAt) return false;

    const timestamp = parseInt(dismissedAt, 10);
    if (isNaN(timestamp)) return false;

    const elapsedDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
    return elapsedDays < this.SNOOZE_DAYS;
  }

  // ── Public User Actions ─────────────────────────────────────
  async promptInstall(): Promise<void> {
    // If native prompt is available (Android / Chromium)
    if (this.deferredPrompt) {
      try {
        await this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          this.showBanner.set(false);
          this.canPromptNative.set(false);
          this.deferredPrompt = null;
        }
      } catch (err) {
        console.warn('[PWA] Error triggering native prompt:', err);
      }
      return;
    }

    // If on iOS or browsers without native prompt support, show visual step-by-step guide
    this.showBanner.set(false);
    this.showGuideModal.set(true);
  }

  dismissBanner(snoozeDays = this.SNOOZE_DAYS): void {
    this.showBanner.set(false);
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
    }
  }

  openGuideModal(): void {
    this.showGuideModal.set(true);
  }

  closeGuideModal(): void {
    this.showGuideModal.set(false);
  }
}
