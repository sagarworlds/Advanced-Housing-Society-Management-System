import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  color: string;
  route: string;
}

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="overview-container">
      <div class="overview-header">
        <h1>Society Admin Dashboard</h1>
        <p>Manage your society from one place</p>
      </div>

      <div class="stats-grid">
        <a class="stat-card" *ngFor="let card of statCards" [routerLink]="card.route" [style.--accent]="card.color">
          <div class="stat-icon">
            <mat-icon>{{ card.icon }}</mat-icon>
          </div>
          <div class="stat-info">
            <p class="stat-label">{{ card.label }}</p>
            <p class="stat-value">{{ card.value }}</p>
          </div>
          <mat-icon class="arrow-icon">chevron_right</mat-icon>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .overview-container { padding: 2rem; }
    .overview-header { margin-bottom: 2rem; }
    .overview-header h1 { font-size: 2rem; font-weight: 800; color: #f1f5f9; margin: 0; }
    .overview-header p { color: #94a3b8; margin: 0.4rem 0 0 0; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .stat-card {
      background: rgba(30,41,59,0.5);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px;
      padding: 1.4rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
      backdrop-filter: blur(10px);
    }

    .stat-card:hover {
      transform: translateY(-3px);
      border-color: var(--accent, #6366f1);
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(var(--accent-rgb, 99,102,241), 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      color: var(--accent, #818cf8);
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .stat-info { flex: 1; }
    .stat-label { color: #94a3b8; font-size: 0.82rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
    .stat-value { color: #f1f5f9; font-size: 1rem; font-weight: 600; margin: 0.25rem 0 0 0; }

    .arrow-icon { color: #475569; font-size: 20px; }
  `]
})
export class AdminOverview {
  statCards: StatCard[] = [
    { label: 'Flats & Owners',          value: 'View flat directory',   icon: 'apartment',       color: '#6366f1', route: '/admin/flats' },
    { label: 'Maintenance & Billing',   value: 'Manage invoices',       icon: 'receipt_long',    color: '#8b5cf6', route: '/admin/maintenance' },
    { label: 'Gate & Visitors',         value: 'Log arrivals',          icon: 'sensor_door',     color: '#10b981', route: '/admin/visitor/guard' },
    { label: 'Helpdesk',                value: 'Resolve complaints',    icon: 'support_agent',   color: '#f59e0b', route: '/admin/helpdesk' },
    { label: 'Facility Booking',        value: 'View bookings',         icon: 'event_available', color: '#0ea5e9', route: '/admin/facility/booking' },
    { label: 'Manage Facilities',       value: 'Add / edit amenities',  icon: 'business',        color: '#a855f7', route: '/admin/facility/manage' },
    { label: 'Notice Board',            value: 'Post announcements',    icon: 'campaign',        color: '#ef4444', route: '/admin/communication/notices' },
    { label: 'Polling',                 value: 'Create & view polls',   icon: 'how_to_vote',     color: '#06b6d4', route: '/admin/communication/polls' },
  ];
}
