import { TestBed } from '@angular/core/testing';
import { PwaGuideModal } from './pwa-guide-modal';
import { PwaService } from '../../services/pwa.service';

describe('PwaGuideModal', () => {
  let pwaService: PwaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaGuideModal],
      providers: [PwaService]
    }).compileComponents();

    pwaService = TestBed.inject(PwaService);
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PwaGuideModal);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render modal when showGuideModal signal is true', () => {
    pwaService.showGuideModal.set(true);
    const fixture = TestBed.createComponent(PwaGuideModal);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.pwa-modal-backdrop')).toBeTruthy();
  });

  it('should not render modal when showGuideModal is false', () => {
    pwaService.showGuideModal.set(false);
    const fixture = TestBed.createComponent(PwaGuideModal);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.pwa-modal-backdrop')).toBeFalsy();
  });
});
