import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AlertDialogData {
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.html',
  styleUrls: ['./alert-dialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class AlertDialog {
  constructor(
    public dialogRef: MatDialogRef<AlertDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData
  ) {}

  get icon(): string {
    return this.data.type === 'success' ? 'check_circle' : 'error';
  }

  get title(): string {
    return this.data.type === 'success' ? 'Success' : 'Error';
  }

  close(): void {
    this.dialogRef.close();
  }
}
