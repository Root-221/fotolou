import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { PwaService, BeforeInstallPromptEvent } from './pwa.service';

describe('PwaService', () => {
  let service: PwaService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(PwaService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect platform and mobile states', () => {
    expect(service.platform()).toBeDefined();
    expect(typeof service.isMobile()).toBe('boolean');
    expect(typeof service.isStandalone()).toBe('boolean');
  });

  it('should open and close the guide modal', () => {
    expect(service.showGuideModal()).toBe(false);
    service.openGuideModal();
    expect(service.showGuideModal()).toBe(true);
    service.closeGuideModal();
    expect(service.showGuideModal()).toBe(false);
  });

  it('should dismiss banner and save timestamp in localStorage', () => {
    service.dismissBanner(7);
    expect(service.showBanner()).toBe(false);
    const saved = localStorage.getItem('fotolou_pwa_dismissed_at');
    expect(saved).toBeTruthy();
  });

  it('should handle appinstalled event by setting standalone mode to true and closing prompts', () => {
    service.showBanner.set(true);
    service.showGuideModal.set(true);

    window.dispatchEvent(new Event('appinstalled'));

    expect(service.isStandalone()).toBe(true);
    expect(service.showBanner()).toBe(false);
    expect(service.showGuideModal()).toBe(false);
  });
});

