import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Card } from '../../../../core/models/card.model';

@Component({
  selector: 'app-card-form-dialog',
  templateUrl: './card-form-dialog.html',
  styleUrls: ['./card-form-dialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class CardFormDialog {
  card: Partial<Card>;
  isEditMode: boolean;
  imagePreview: string | null = null;
  imageFile: File | null = null;

  genderOptions = [
    { label: 'Male', value: 0 },
    { label: 'Female', value: 1 }
  ];

  constructor(
    public dialogRef: MatDialogRef<CardFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { card?: Card; mode: 'create' | 'edit' }
  ) {
    this.isEditMode = data.mode === 'edit';
    this.card = data.card ? { ...data.card } : {
      name: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      birthDate: new Date(),
      image: ''
    };
    
    
    if (this.card.image) {
      this.imagePreview = this.card.image;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.imageFile = null;
    this.card.image = '';
  }

  onSubmit(): void {
    if (this.isValid()) {
      const result = {
        ...this.card,
        imageFile: this.imageFile
      };
      this.dialogRef.close(result);
    }
  }

  isValid(): boolean {
    return !!(
      this.card.name && 
      (this.card.gender !== null && this.card.gender !== undefined && this.card.gender !== '') && 
      this.card.email && 
      this.card.phone
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
