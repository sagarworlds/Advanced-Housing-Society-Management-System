import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SuperAdminService, Society, ModuleInfo } from '../../core/services/superadmin';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './superadmin.html',
  styleUrls: ['./superadmin.css']
})
export class SuperAdminDashboard implements OnInit {
  private saService = inject(SuperAdminService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  societies: Society[] = [];
  modules: ModuleInfo[] = [];
  displayedColumns: string[] = ['name', 'domain', 'createdAt', 'status', 'modules', 'actions'];
  
  loading = false;
  editingSocietyId: string | null = null;
  tempSelectedModules: string[] = [];

  // KPI stats
  totalSocieties = 0;
  activeSocieties = 0;
  estimatedRevenue = 0;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.saService.getAvailableModules().subscribe({
      next: (mods) => {
        this.modules = mods;
        this.loadSocieties();
      },
      error: () => {
        this.snackBar.open('Error loading modules.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadSocieties() {
    this.saService.getSocieties().subscribe({
      next: (data) => {
        this.societies = data;
        this.calculateKPIs();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading societies. Make sure you are logged in as SuperAdmin.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  calculateKPIs() {
    this.totalSocieties = this.societies.length;
    this.activeSocieties = this.societies.filter(s => s.isActive).length;
    
    // Calculate estimate based on module prices of active societies
    let total = 0;
    this.societies.forEach(soc => {
      if (soc.isActive && soc.selectedModuleIds) {
        soc.selectedModuleIds.forEach(modName => {
          const mod = this.modules.find(m => m.name === modName);
          if (mod) {
            total += Number(mod.monthlyPrice);
          }
        });
      }
    });
    this.estimatedRevenue = total;
  }

  toggleStatus(society: Society) {
    this.saService.toggleSocietyStatus(society.id).subscribe({
      next: (res) => {
        society.isActive = res.isActive;
        this.calculateKPIs();
        this.snackBar.open(res.message, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to update society status.', 'Close', { duration: 3000 });
      }
    });
  }

  startEditModules(society: Society) {
    this.editingSocietyId = society.id;
    this.tempSelectedModules = [...(society.selectedModuleIds || [])];
  }

  cancelEditModules() {
    this.editingSocietyId = null;
    this.tempSelectedModules = [];
  }

  isModuleSelected(modName: string): boolean {
    return this.tempSelectedModules.includes(modName);
  }

  toggleModuleSelection(modName: string, checked: boolean) {
    if (checked) {
      if (!this.tempSelectedModules.includes(modName)) {
        this.tempSelectedModules.push(modName);
      }
    } else {
      this.tempSelectedModules = this.tempSelectedModules.filter(name => name !== modName);
    }
  }

  saveModules() {
    if (!this.editingSocietyId) return;
    const society = this.societies.find(s => s.id === this.editingSocietyId);
    if (!society) return;
    
    this.loading = true;
    this.saService.updateSocietyModules(society.id, this.tempSelectedModules).subscribe({
      next: (res) => {
        society.selectedModuleIds = [...this.tempSelectedModules];
        this.editingSocietyId = null;
        this.calculateKPIs();
        this.snackBar.open(res.message, 'Close', { duration: 3000 });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to update society modules.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}
