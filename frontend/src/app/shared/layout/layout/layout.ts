import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/auth/services/auth.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly authService = inject(AuthService);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  readonly sidenavCollapsed = signal(false);
  readonly mobileOpen = signal(false);

  readonly isMobile = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard' },
    { label: "Appels d'offres", icon: 'campaign', route: '/appels-offres' },
    { label: 'Suivi des décisions', icon: 'fact_check', route: '/decisions' },
    { label: 'Dossiers de soumission', icon: 'folder_shared', route: '/soumissions' },
    { label: 'Gestion des contrats', icon: 'description', route: '/contrats' },
    { label: 'Engagements & Échéances', icon: 'event_note', route: '/engagements' },
    { label: 'Notifications', icon: 'notifications', route: '/notifications', badge: 3 },
  ];

  readonly userInitials = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '?';
    const f = user.firstName?.[0] ?? '';
    const l = user.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || user.email?.[0]?.toUpperCase() || '?';
  });

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile.set(result.matches);
      if (result.matches) {
        this.sidenavCollapsed.set(false);
      }
    });
  }

  toggleSidenav(): void {
    if (this.isMobile()) {
      this.mobileOpen.update((v) => !v);
    } else {
      this.sidenavCollapsed.update((v) => !v);
    }
  }

  onNavItemClick(): void {
    if (this.isMobile()) {
      this.mobileOpen.set(false);
    }
  }
}
