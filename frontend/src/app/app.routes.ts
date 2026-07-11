import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Onboard } from './features/auth/onboard/onboard';
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
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'onboard', component: Onboard },
  { path: 'maintenance', component: Maintenance },
  { path: 'visitor/guard', component: Guard },
  { path: 'visitor/resident', component: Resident },
  { path: 'helpdesk/resident', component: HelpdeskResident },
  { path: 'helpdesk/admin', component: HelpdeskAdmin },
  { path: 'facility/booking', component: FacilityBooking },
  { path: 'facility/admin', component: FacilityAdmin },
  { path: 'communication/notice-board', component: NoticeBoard },
  { path: 'communication/polling', component: Polling },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
