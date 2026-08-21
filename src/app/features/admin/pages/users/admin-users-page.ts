import { Component, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';
import { AdminBadge } from '../../components/admin-badge/admin-badge';
import { AdminPagination } from '../../components/admin-pagination/admin-pagination';

@Component({
  selector: 'app-admin-users-page',
  imports: [FormsModule, AdminBadge, AdminPagination],
  template: `
    <div class="admin-page">
      
      <!-- Page Header -->
      <div class="admin-page__header">
        <div>
          <h1>Utilisateurs Clients</h1>
          <p>Consultez la base des clients utilisant l'application mobile Fotolou pour réserver des tickets.</p>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="admin-toolbar">
        <div class="admin-search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="currentPage.set(1)"
            placeholder="Rechercher par nom, téléphone ou quartier..."
          />
        </div>
      </div>

      <!-- Users Table Card -->
      <div class="admin-card">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Quartier</th>
                <th>Tickets pris</th>
                <th>Proches enregistrés</th>
                <th>Inscrit depuis</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (user of paginatedUsers(); track user.id) {
                <tr>
                  <td>
                    <div class="admin-table__item-with-avatar">
                      <div class="admin-user-avatar">
                        {{ user.name.substring(0, 2).toUpperCase() }}
                      </div>
                      <strong>{{ user.name }}</strong>
                    </div>
                  </td>
                  <td>{{ user.phone }}</td>
                  <td>{{ user.district }}</td>
                  <td>
                    <strong>{{ user.ticketsCount }}</strong> tickets
                  </td>
                  <td>
                    <span class="admin-badge admin-badge--neutral">
                      {{ user.relativesCount }} proche(s)
                    </span>
                  </td>
                  <td>{{ user.createdAt }}</td>
                  <td>
                    <app-admin-badge variant="success">Actif</app-admin-badge>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="admin-table__empty">
                    Aucun client trouvé.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <app-admin-pagination
          [totalItems]="filteredUsers().length"
          [pageSize]="pageSize()"
          [currentPage]="currentPage()"
          (pageChange)="currentPage.set($event)"
          (pageSizeChange)="pageSize.set($event)"
        />
      </div>

    </div>
  `,
  styleUrl: './admin-users-page.scss'
})
export class AdminUsersPage {
  protected readonly data = inject(AdminDataService);

  protected searchQuery = '';

  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(6);

  protected readonly filteredUsers = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();

    return this.data.clients().filter(u => {
      return (
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.district.toLowerCase().includes(q)
      );
    });
  });

  protected readonly paginatedUsers = computed(() => {
    const list = this.filteredUsers();
    const start = (this.currentPage() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });
}
