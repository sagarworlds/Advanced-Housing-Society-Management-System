import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './admin-shell.html',
  styleUrls: ['./admin-shell.css']
})
export class AdminShell {
  private router = inject(Router);

  sidebarCollapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard',        icon: 'dashboard',              route: '/admin/dashboard' },
    { label: 'Flats & Owners',   icon: 'apartment',              route: '/admin/flats' },
    { label: 'Maintenance',      icon: 'receipt_long',           route: '/admin/maintenance' },
    { label: 'Visitor Gate',     icon: 'sensor_door',            route: '/admin/visitor/guard' },
    { label: 'Helpdesk',         icon: 'support_agent',          route: '/admin/helpdesk' },
    { label: 'Facility Booking', icon: 'event_available',        route: '/admin/facility/booking' },
    { label: 'Facilities',       icon: 'business',               route: '/admin/facility/manage' },
    { label: 'Notice Board',     icon: 'campaign',               route: '/admin/communication/notices' },
    { label: 'Polling',          icon: 'how_to_vote',            route: '/admin/communication/polls' },
  ];

  get societyName(): string {
    return 'Society Admin';
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}
