import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog, AlertDialogData } from '../../shared/components/UI/alert-dialog/alert-dialog';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  showSuccess(message: string): void {
    this.dialog.open(AlertDialog, {
      width: '480px',
      maxWidth: '90vw',
      data: {
        type: 'success',
        message: message
      } as AlertDialogData,
      panelClass: 'custom-dialog-container',
      autoFocus: false
    });
  }

  showError(message: string): void {
    this.dialog.open(AlertDialog, {
      width: '480px',
      maxWidth: '90vw',
      data: {
        type: 'error',
        message: message
      } as AlertDialogData,
      panelClass: 'custom-dialog-container',
      autoFocus: false
    });
  }
}
