import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ImagePreset {
  label: string;
  url: string;
  category: string;
}

@Component({
  selector: 'app-admin-image-uploader',
  imports: [FormsModule],
  template: `
    <div class="admin-uploader">
      
      <div class="admin-uploader__label-row">
        <label class="admin-uploader__label">{{ label }}</label>
        <div class="admin-uploader__tabs">
          <button
            type="button"
            class="admin-uploader__tab-btn"
            [class.active]="activeTab() === 'upload'"
            (click)="activeTab.set('upload')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px; vertical-align: -2px; margin-right: 4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Fichier</span>
          </button>
          <button
            type="button"
            class="admin-uploader__tab-btn"
            [class.active]="activeTab() === 'presets'"
            (click)="activeTab.set('presets')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px; vertical-align: -2px; margin-right: 4px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>Galerie</span>
          </button>
          <button
            type="button"
            class="admin-uploader__tab-btn"
            [class.active]="activeTab() === 'url'"
            (click)="activeTab.set('url')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px; vertical-align: -2px; margin-right: 4px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span>Lien URL</span>
          </button>
        </div>
      </div>

      <!-- Preview + Drag & Drop Upload Zone -->
      @if (imageUrl) {
        <div class="admin-uploader__preview-wrap">
          <img [src]="imageUrl" [alt]="label" class="admin-uploader__preview-img" />
          <div class="admin-uploader__preview-overlay">
            <button
              type="button"
              class="admin-uploader__btn-change"
              (click)="fileInput.click()"
            >
              Changer la photo
            </button>
            <button
              type="button"
              class="admin-uploader__btn-remove"
              (click)="removeImage()"
            >
              Supprimer
            </button>
          </div>
        </div>
      } @else {
        <!-- Upload Tab -->
        @if (activeTab() === 'upload') {
          <div
            class="admin-uploader__dropzone"
            [class.dragover]="isDragging()"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
          >
            <div class="admin-uploader__drop-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div class="admin-uploader__drop-text">
              <strong>Cliquez ou glissez une photo ici</strong>
              <span>JPG, PNG, WebP jusqu'à 5 Mo</span>
            </div>
          </div>
        }

        <!-- Presets Tab -->
        @if (activeTab() === 'presets') {
          <div class="admin-uploader__presets-grid">
            @for (preset of presets; track preset.url) {
              <button
                type="button"
                class="admin-uploader__preset-item"
                (click)="selectPreset(preset.url)"
                [title]="preset.label"
              >
                <img [src]="preset.url" [alt]="preset.label" />
                <span>{{ preset.label }}</span>
              </button>
            }
          </div>
        }

        <!-- URL Input Tab -->
        @if (activeTab() === 'url') {
          <div class="admin-uploader__url-box">
            <input
              type="text"
              [(ngModel)]="manualUrl"
              placeholder="https://images.unsplash.com/..."
              (keydown.enter)="applyManualUrl()"
            />
            <button type="button" class="admin-uploader__btn-apply" (click)="applyManualUrl()">
              Appliquer
            </button>
          </div>
        }
      }

      <input
        #fileInput
        type="file"
        accept="image/*"
        style="display: none"
        (change)="onFileSelected($event)"
      />

    </div>
  `,
  styleUrl: './admin-image-uploader.scss'
})
export class AdminImageUploader {
  @Input() label = 'Photo / Image';
  @Input() imageUrl = '';
  @Output() imageUrlChange = new EventEmitter<string>();

  protected readonly activeTab = signal<'upload' | 'presets' | 'url'>('upload');
  protected readonly isDragging = signal<boolean>(false);
  protected manualUrl = '';

  protected readonly presets: ImagePreset[] = [
    {
      label: 'King Barber Dakar',
      url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
      category: 'salon'
    },
    {
      label: 'Prestige Lounge',
      url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80',
      category: 'salon'
    },
    {
      label: 'Élégance Coiffure',
      url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      category: 'salon'
    },
    {
      label: 'Tondeuse Pro Wahl',
      url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80',
      category: 'product'
    },
    {
      label: 'Huile Soin Barbe',
      url: 'https://images.unsplash.com/photo-1608248597359-251f49e49631?auto=format&fit=crop&w=600&q=80',
      category: 'product'
    },
    {
      label: 'Shampoing Capillaire',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      category: 'product'
    }
  ];

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.readFile(input.files[0]);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.readFile(event.dataTransfer.files[0]);
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      if (result) {
        this.imageUrl = result;
        this.imageUrlChange.emit(result);
      }
    };
    reader.readAsDataURL(file);
  }

  protected selectPreset(url: string): void {
    this.imageUrl = url;
    this.imageUrlChange.emit(url);
  }

  protected applyManualUrl(): void {
    if (this.manualUrl.trim()) {
      this.imageUrl = this.manualUrl.trim();
      this.imageUrlChange.emit(this.imageUrl);
      this.manualUrl = '';
    }
  }

  protected removeImage(): void {
    this.imageUrl = '';
    this.imageUrlChange.emit('');
  }
}
