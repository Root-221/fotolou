import { Component, Input } from '@angular/core';
import { BottomNavigation, BottomNavItem, UserRole } from '../bottom-navigation/bottom-navigation';

@Component({
  selector: 'app-client-layout',
  imports: [BottomNavigation],
  template: `
    <div
      class="client-layout"
      [class.client-layout--bleed-header]="bleedHeader"
    >
      <!-- Fixed Header Slot -->
      @if (hasHeaderSlot) {
        <header class="client-layout__header">
          <ng-content select="[slot=header], [header]" />
        </header>
      }

      <!-- Scrollable Main Content -->
      <main class="client-layout__body">
        <ng-content />
      </main>

      <!-- Fixed Footer Slot (Bottom Nav or Custom Action Button) -->
      @if (showBottomNav || hasCustomFooter) {
        <footer class="client-layout__footer">
          <ng-content select="[slot=footer], [footer]" />

          @if (showBottomNav) {
            <app-bottom-navigation [activeItem]="activeNav" [role]="role" />
          }
        </footer>
      }
    </div>
  `,
  styleUrl: './client-layout.scss'
})
export class ClientLayout {
  @Input() activeNav: BottomNavItem = 'home';
  @Input() role?: UserRole;
  @Input() showBottomNav = true;
  @Input() bleedHeader = false;
  @Input() hasHeaderSlot = true;
  @Input() hasCustomFooter = false;
}
