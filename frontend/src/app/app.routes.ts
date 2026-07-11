import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { FlatsManagement } from './features/flats/flats';
import { Onboard } from './features/auth/onboard/onboard';
import { SuperAdminDashboard } from './features/superadmin/superadmin';
import { AdminShell } from './features/admin-shell/admin-shell';
import { AdminOverview } from './features/admin-shell/admin-overview';
import { Maintenance } from './features/maintenance/maintenance';
import { Guard } from './features/visitor/guard/guard';
import { Resident } from './features/visitor/resident/resident';
import { Resident as HelpdeskResident } from './features/helpdesk/resident/resident';
import { Admin as HelpdeskAdmin } from './features/helpdesk/admin/admin';
import { Booking as FacilityBooking } from './features/facility/booking/booking';
import { Admin as FacilityAdmin } from './features/facility/admin/admin';
import { NoticeBoard } from './features/communication/notice-board/notice-board';
import { Polling } from './features/communication/polling/polling';

export const routes: Routes = [
  { path: 'login',    component: Login },
  { path: 'register', component: Register },
  { path: 'onboard',  component: Onboard },
  { path: 'superadmin/dashboard', component: SuperAdminDashboard },

  // Society Admin Shell — all admin pages share the sidebar layout
  {
    path: 'admin',
    component: AdminShell,
    children: [
      { path: '',                      redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',             component: AdminOverview },
      { path: 'flats',                 component: FlatsManagement },
      { path: 'maintenance',           component: Maintenance },
      { path: 'visitor/guard',         component: Guard },
      { path: 'visitor/resident',      component: Resident },
      { path: 'helpdesk',              component: HelpdeskAdmin },
      { path: 'helpdesk/resident',     component: HelpdeskResident },
      { path: 'facility/booking',      component: FacilityBooking },
      { path: 'facility/manage',       component: FacilityAdmin },
      { path: 'communication/notices', component: NoticeBoard },
      { path: 'communication/polls',   component: Polling },
    ]
  },

  // Legacy flat routes kept for backward compat (residents / guard)
  { path: 'maintenance',              component: Maintenance },
  { path: 'visitor/guard',            component: Guard },
  { path: 'visitor/resident',         component: Resident },
  { path: 'helpdesk/resident',        component: HelpdeskResident },
  { path: 'helpdesk/admin',           component: HelpdeskAdmin },
  { path: 'facility/booking',         component: FacilityBooking },
  { path: 'facility/admin',           component: FacilityAdmin },
  { path: 'communication/notice-board', component: NoticeBoard },
  { path: 'communication/polling',    component: Polling },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

