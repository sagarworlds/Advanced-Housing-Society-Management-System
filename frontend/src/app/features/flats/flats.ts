import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MaintenanceService, Flat, FlatRequest } from '../../core/services/maintenance';

@Component({
  selector: 'app-flats-management',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  templateUrl: './flats.html',
  styleUrls: ['./flats.css']
})
export class FlatsManagement implements OnInit {
  private maintenanceService = inject(MaintenanceService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  flats: Flat[] = [];
  loading = false;
  showForm = false;
  editingId: string | null = null;
  createdCredentials: { username: string; password: string; flatLabel: string } | null = null;

  get ownerCount()  { return this.flats.filter(f => f.occupancyStatus === 'Owner').length; }
  get tenantCount() { return this.flats.filter(f => f.occupancyStatus === 'Tenant').length; }
  get vacantCount() { return this.flats.filter(f => f.occupancyStatus === 'Vacant').length; }

  flatTypes = ['1BHK', '2BHK', '3BHK', '4BHK', 'Penthouse', 'Studio'];
  occupancyOptions = ['Owner', 'Tenant', 'Vacant'];

  flatForm = this.fb.group({
    block:               ['', Validators.required],
    flatNumber:          ['', Validators.required],
    floor:               [0, [Validators.required, Validators.min(0)]],
    flatType:            ['2BHK', Validators.required],
    ownerName:           ['', Validators.required],
    ownerPhone:          ['', Validators.required],
    ownerEmail:          ['', [Validators.required, Validators.email]],
    occupancyStatus:     ['Owner', Validators.required],
    maintenanceAreaSqFt: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() { this.loadFlats(); }

  loadFlats() {
    this.loading = true;
    this.maintenanceService.getFlats().subscribe({
      next: (data) => {
        this.flats = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Failed to load flats', 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddForm() {
    this.editingId = null;
    this.flatForm.reset({ flatType: '2BHK', occupancyStatus: 'Owner', floor: 0, maintenanceAreaSqFt: 0 });
    this.showForm = true;
  }

  openEditForm(flat: Flat) {
    this.editingId = flat.id;
    this.flatForm.patchValue({
      block:               flat.block,
      flatNumber:          flat.flatNumber,
      floor:               flat.floor,
      flatType:            flat.flatType,
      ownerName:           flat.ownerName,
      ownerPhone:          flat.ownerPhone,
      ownerEmail:          flat.ownerEmail,
      occupancyStatus:     flat.occupancyStatus,
      maintenanceAreaSqFt: flat.maintenanceAreaSqFt
    });
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.flatForm.reset();
  }

  onSubmit() {
    if (this.flatForm.invalid) return;
    const val = this.flatForm.value;
    const payload: FlatRequest = {
      block:               val.block!,
      flatNumber:          val.flatNumber!,
      floor:               Number(val.floor),
      flatType:            val.flatType!,
      ownerName:           val.ownerName!,
      ownerPhone:          val.ownerPhone!,
      ownerEmail:          val.ownerEmail!,
      occupancyStatus:     val.occupancyStatus!,
      maintenanceAreaSqFt: Number(val.maintenanceAreaSqFt)
    };

    this.loading = true;
    const request$ = this.editingId
      ? this.maintenanceService.updateFlat(this.editingId, payload)
      : this.maintenanceService.createFlat(payload);

    const flatLabel = `${payload.block}-${payload.flatNumber}`;

    request$.subscribe({
      next: (res: any) => {
        this.cancelForm();
        if (res?.userCreated && res?.username) {
          this.createdCredentials = {
            username: res.username,
            password: 'Password!23',
            flatLabel
          };
        } else {
          this.snackBar.open(this.editingId ? 'Flat updated!' : 'Flat added!', 'Close', { duration: 3000 });
        }
        this.loadFlats();
      },
      error: (err) => {
        let msg = 'Failed to save flat.';
        if (err?.error?.errors && Array.isArray(err.error.errors)) {
          msg = err.error.errors.join(' | ');
        } else if (err?.error?.message) {
          msg = err.error.message;
        }
        this.snackBar.open(msg, 'Close', { duration: 6000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteFlat(flat: Flat) {
    if (!confirm(`Delete flat ${flat.block}-${flat.flatNumber} owned by ${flat.ownerName}?`)) return;
    this.maintenanceService.deleteFlat(flat.id).subscribe({
      next: () => {
        this.snackBar.open('Flat deleted.', 'Close', { duration: 3000 });
        this.flats = this.flats.filter(f => f.id !== flat.id);
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Failed to delete flat.', 'Close', { duration: 3000 })
    });
  }

  occupancyBadge(status: string): string {
    if (status === 'Tenant') return 'badge-blue';
    if (status === 'Vacant') return 'badge-red';
    return 'badge-green';
  }
}
