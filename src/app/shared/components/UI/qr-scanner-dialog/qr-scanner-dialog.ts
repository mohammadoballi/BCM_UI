import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { CardService } from '../../../../core/services/card.service';
import { AlertService } from '../../../../core/services/alert.service';
@Component({
  selector: 'app-qr-scanner-dialog',
  templateUrl: './qr-scanner-dialog.html',
  styleUrls: ['./qr-scanner-dialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
})
export class QRScannerDialog implements OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  stream: MediaStream | null = null;
  capturedImage: string | null = null;
  selectedFile: File | null = null;
  error: string = '';
  cameraActive: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<QRScannerDialog>,
    private spinnerService: SpinnerService,
    private cardservice: CardService,
    private alertService: AlertService
  ) {}

  ngOnDestroy(): void {
    this.stopCamera();
  }

  async startCamera(): Promise<void> {
    try {
      this.error = '';
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setTimeout(() => {
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
          this.cameraActive = true;
        }
      }, 100);
    } catch (err) {
      this.error = 'Unable to access camera. Please check permissions.';
      console.error('Camera error:', err);
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.cameraActive = false;
    }
  }

  capturePhoto(): void {
    if (!this.videoElement || !this.canvasElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      this.capturedImage = canvas.toDataURL('image/jpeg');
      this.stopCamera();
    }
  }

  retakePhoto(): void {
    this.capturedImage = null;
    this.startCamera();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.error = '';
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.capturedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.error = 'Please select a valid image file';
      }
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  async submitQRCode(): Promise<void> {
    let fileToSend: File | null = null;

    if (this.capturedImage && !this.selectedFile) {
      // Convert captured image to File
      const blob = await fetch(this.capturedImage).then(r => r.blob());
      fileToSend = new File([blob], 'qr-code.jpg', { type: 'image/jpeg' });
    } else if (this.selectedFile) {
      fileToSend = this.selectedFile;
    }

    if (fileToSend) {
      this.cardservice.ImportQrCode(fileToSend).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.alertService.showSuccess(res.message_en || 'QR code imported successfully');
            this.dialogRef.close({ file: fileToSend });
          } else {
            this.alertService.showError(res.message_en || 'Failed to import QR code');
          }
        },
        error: () => {
          this.alertService.showError('An error occurred while importing the QR code');
        }
      });
    }
  }

  close(): void {
    this.stopCamera();
    this.dialogRef.close();
  }
}
