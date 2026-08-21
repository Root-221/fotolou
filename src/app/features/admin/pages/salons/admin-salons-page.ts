import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { AdminBadge } from '../../components/admin-badge/admin-badge';
import { AdminModal } from '../../components/admin-modal/admin-modal';
import { AdminImageUploader } from '../../components/admin-image-uploader/admin-image-uploader';
import { AdminPagination } from '../../components/admin-pagination/admin-pagination';
import { AdminViewToggle, AdminViewMode } from '../../components/admin-view-toggle/admin-view-toggle';
import { Salon } from '../../../../shared/models/salon';

@Component({
  selector: 'app-admin-salons-page',
  imports: [FormsModule, AdminBadge, AdminModal, AdminImageUploader, AdminPagination, AdminViewToggle],
  template: `
    <div class="admin-page">
      
      <!-- Page Header -->
      <div class="admin-page__header">
        <div>
          <h1>Gestion des Salons Partenaires</h1>
          <p>Supervisez, ajoutez et modifiez les salons de coiffure référencés sur Fotolou.</p>
        </div>
        <button type="button" class="admin-btn admin-btn--primary" (click)="openAddModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Nouveau Salon</span>
        </button>
      </div>

      <!-- Filter / Search & View Switcher Toolbar -->
      <div class="admin-toolbar">
        <div class="admin-search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="currentPage.set(1)"
            placeholder="Rechercher un salon par nom ou quartier..."
          />
        </div>

        <div class="admin-toolbar__right">
          <div class="admin-filter-group">
            <select [(ngModel)]="statusFilter" (ngModelChange)="currentPage.set(1)">
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="closed">Fermé</option>
            </select>
          </div>

          <app-admin-view-toggle [(viewMode)]="viewMode" />
        </div>
      </div>

      <!-- Salons View: Table Mode -->
      @if (viewMode === 'table') {
        <div class="admin-card">
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Salon</th>
                  <th>Quartier &bull; Ville</th>
                  <th>Téléphone</th>
                  <th>Personnes en attente</th>
                  <th>Statut</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (salon of paginatedSalons(); track salon.id) {
                  <tr>
                    <td>
                      <div class="admin-table__item-with-img">
                        <img [src]="salon.avatarUrl || salon.coverUrl" [alt]="salon.name" class="admin-table__thumb" />
                        <div>
                          <strong>{{ salon.name }}</strong>
                          <span class="admin-table__subtext">ID: {{ salon.id }}</span>
                        </div>
                      </div>
                    </td>
                    <td>{{ salon.district || salon.location }}</td>
                    <td>{{ salon.phone || '+221 77 000 00 00' }}</td>
                    <td>
                      <span class="admin-badge admin-badge--primary">{{ salon.peopleWaiting }} en file</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        class="admin-status-toggle"
                        (click)="data.toggleSalonStatus(salon.id)"
                        [title]="salon.status === 'open' ? 'Cliquer pour fermer' : 'Cliquer pour ouvrir'"
                      >
                        <app-admin-badge [variant]="salon.status === 'open' ? 'success' : 'danger'">
                          {{ salon.status === 'open' ? 'Ouvert' : 'Fermé' }}
                        </app-admin-badge>
                      </button>
                    </td>
                    <td style="text-align: right;">
                      <div class="admin-table__actions">
                        <button type="button" class="admin-icon-btn" (click)="openEditModal(salon)" title="Modifier">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button type="button" class="admin-icon-btn admin-icon-btn--danger" (click)="deleteSalon(salon)" title="Supprimer">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="admin-table__empty">
                      Aucun salon ne correspond à votre recherche.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <app-admin-pagination
            [totalItems]="filteredSalons().length"
            [pageSize]="pageSize()"
            [currentPage]="currentPage()"
            (pageChange)="currentPage.set($event)"
            (pageSizeChange)="pageSize.set($event)"
          />
        </div>
      }

      <!-- Salons View: Grid Mode -->
      @if (viewMode === 'grid') {
        <div class="admin-grid-cards">
          @for (salon of paginatedSalons(); track salon.id) {
            <div class="admin-grid-card">
              <div class="admin-grid-card__cover">
                <img [src]="salon.coverUrl || salon.avatarUrl" [alt]="salon.name" />
                <div class="admin-grid-card__status-tag">
                  <app-admin-badge [variant]="salon.status === 'open' ? 'success' : 'danger'">
                    {{ salon.status === 'open' ? 'Ouvert' : 'Fermé' }}
                  </app-admin-badge>
                </div>
              </div>

              <div class="admin-grid-card__body">
                <div class="admin-grid-card__header">
                  <h3>{{ salon.name }}</h3>
                  <span class="admin-grid-card__badge">{{ salon.peopleWaiting }} pers. en file</span>
                </div>
                <div class="admin-grid-card__meta">
                  <span>📍 {{ salon.district || salon.location }}</span>
                  <span>📞 {{ salon.phone || '+221 77 000 00 00' }}</span>
                </div>
              </div>

              <div class="admin-grid-card__footer">
                <button
                  type="button"
                  class="admin-btn-secondary"
                  (click)="data.toggleSalonStatus(salon.id)"
                >
                  {{ salon.status === 'open' ? 'Fermer' : 'Ouvrir' }}
                </button>

                <div class="admin-grid-card__actions">
                  <button type="button" class="admin-icon-btn" (click)="openEditModal(salon)" title="Modifier">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </button>
                  <button type="button" class="admin-icon-btn admin-icon-btn--danger" (click)="deleteSalon(salon)" title="Supprimer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="admin-table__empty" style="grid-column: 1 / -1; background: #ffffff; border-radius: 16px; padding: 40px; text-align: center;">
              Aucun salon trouvé.
            </div>
          }
        </div>

        <div class="admin-card" style="margin-top: 16px;">
          <app-admin-pagination
            [totalItems]="filteredSalons().length"
            [pageSize]="pageSize()"
            [currentPage]="currentPage()"
            (pageChange)="currentPage.set($event)"
            (pageSizeChange)="pageSize.set($event)"
          />
        </div>
      }

      <!-- Add / Edit Salon Modal -->
      <app-admin-modal
        [title]="editingSalonId() ? 'Modifier le Salon' : 'Ajouter un Nouveau Salon'"
        [isOpen]="isModalOpen()"
        (close)="isModalOpen.set(false)"
      >
        <form class="admin-form" (ngSubmit)="saveSalon()">
          <div class="admin-form__row">
            <div class="admin-form__field">
              <label>Nom du salon *</label>
              <input type="text" [(ngModel)]="formName" name="name" required placeholder="Ex: Dakar Barber Lounge" />
            </div>
            <div class="admin-form__field">
              <label>Quartier *</label>
              <input type="text" [(ngModel)]="formDistrict" name="district" required placeholder="Ex: Mermoz, Almadies..." />
            </div>
          </div>

          <div class="admin-form__row">
            <div class="admin-form__field">
              <label>Adresse complète</label>
              <input type="text" [(ngModel)]="formLocation" name="location" placeholder="Ex: Route de Ouakam, Dakar" />
            </div>
            <div class="admin-form__field">
              <label>Numéro de téléphone</label>
              <input type="text" [(ngModel)]="formPhone" name="phone" placeholder="+221 77 123 45 67" />
            </div>
          </div>

          <app-admin-image-uploader
            label="Photo / Couverture du salon"
            [(imageUrl)]="formCoverUrl"
          />

          <div class="admin-form__field">
            <label>Statut initial</label>
            <select [(ngModel)]="formStatus" name="status">
              <option value="open">Ouvert</option>
              <option value="closed">Fermé</option>
            </select>
          </div>
        </form>

        <div footer-actions>
          <button type="button" class="admin-btn admin-btn--primary" (click)="saveSalon()">
            {{ editingSalonId() ? 'Enregistrer les modifications' : 'Ajouter le salon' }}
          </button>
        </div>
      </app-admin-modal>

    </div>
  `,
  styleUrl: './admin-salons-page.scss'
})
export class AdminSalonsPage {
  protected readonly data = inject(AdminDataService);

  protected searchQuery = '';
  protected statusFilter = 'all';
  protected viewMode: AdminViewMode = 'table';

  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(6);

  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly editingSalonId = signal<string | null>(null);

  protected formName = '';
  protected formDistrict = '';
  protected formLocation = '';
  protected formPhone = '';
  protected formCoverUrl = '';
  protected formStatus: 'open' | 'closed' = 'open';

  protected readonly filteredSalons = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    const st = this.statusFilter;

    return this.data.salons().filter(salon => {
      const matchQuery =
        !q ||
        salon.name.toLowerCase().includes(q) ||
        (salon.district && salon.district.toLowerCase().includes(q)) ||
        (salon.location && salon.location.toLowerCase().includes(q));

      const matchStatus = st === 'all' || salon.status === st;

      return matchQuery && matchStatus;
    });
  });

  protected readonly paginatedSalons = computed(() => {
    const list = this.filteredSalons();
    const start = (this.currentPage() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  protected openAddModal(): void {
    this.editingSalonId.set(null);
    this.formName = '';
    this.formDistrict = 'Mermoz';
    this.formLocation = 'Dakar, Sénégal';
    this.formPhone = '+221 77 123 45 67';
    this.formCoverUrl = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80';
    this.formStatus = 'open';
    this.isModalOpen.set(true);
  }

  protected openEditModal(salon: Salon): void {
    this.editingSalonId.set(salon.id);
    this.formName = salon.name;
    this.formDistrict = salon.district || '';
    this.formLocation = salon.location || '';
    this.formPhone = salon.phone || '';
    this.formCoverUrl = salon.coverUrl || salon.avatarUrl || '';
    this.formStatus = salon.status;
    this.isModalOpen.set(true);
  }

  protected saveSalon(): void {
    if (!this.formName.trim()) return;

    if (this.editingSalonId()) {
      this.data.updateSalon(this.editingSalonId()!, {
        name: this.formName,
        district: this.formDistrict,
        location: this.formLocation,
        phone: this.formPhone,
        coverUrl: this.formCoverUrl,
        avatarUrl: this.formCoverUrl,
        status: this.formStatus
      });
    } else {
      const slug = this.formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newSalon: Salon = {
        id: slug || 'salon-' + Date.now(),
        name: this.formName,
        district: this.formDistrict,
        location: this.formLocation,
        phone: this.formPhone,
        coverUrl: this.formCoverUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        avatarUrl: this.formCoverUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80',
        status: this.formStatus,
        peopleWaiting: 0,
        actions: [
          { label: 'Appeler', icon: 'phone', href: 'tel:' + (this.formPhone || '') },
          { label: 'Partager', icon: 'share', href: '#' }
        ]
      };
      this.data.addSalon(newSalon);
    }

    this.isModalOpen.set(false);
  }

  protected deleteSalon(salon: Salon): void {
    if (confirm(`Confirmez-vous la suppression du salon "${salon.name}" ?`)) {
      this.data.deleteSalon(salon.id);
    }
  }
}
