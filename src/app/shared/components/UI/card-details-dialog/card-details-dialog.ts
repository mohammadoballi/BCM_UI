import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../../../../core/models/card.model';
@Component({
  selector: 'app-card-details-dialog',
  templateUrl: './card-details-dialog.html',
  styleUrls: ['./card-details-dialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class CardDetailsDialog {
  @ViewChild('cardContent', { static: false }) cardContent!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<CardDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { card: Card }
  ) {}



  close(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  downloadCard(): void {
    // Use html2canvas to capture the card as an image
    import('html2canvas').then((html2canvas) => {
      const cardElement = this.cardContent.nativeElement.querySelector('.business-card-template');
      
      html2canvas.default(cardElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      }).then((canvas) => {
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.data.card.name.replace(/\s+/g, '_')}_business_card.png`;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
      });
    }).catch((error) => {
      console.error('Error loading html2canvas:', error);
      alert('Download feature requires html2canvas library. Please install it.');
    });
  }
}
