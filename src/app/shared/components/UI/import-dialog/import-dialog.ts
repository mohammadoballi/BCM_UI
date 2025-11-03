import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { CardService } from '../../../../core/services/card.service';
import { AlertService } from '../../../../core/services/alert.service';
import { numberToGender } from '../../../../core/utils/gender.utils';
import {Table} from '../table/table' 
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.html',
  styleUrls: ['./import-dialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    Table
  ],
})
export class ImportDialog {
  selectedFile: File | null = null;
  fileName: string = '';
  fileType: string = '';
  uploading: boolean = false;
  uploadProgress: number = 0;
  previewData: any[] = [];
  tableColumns: { key: string; label: string }[] = [];
  error: string = '';

  isDragging: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ImportDialog>,
    private spinnerService: SpinnerService,
    private cardservice: CardService,
    private alertService: AlertService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  parseFile(file: File): void {
    const reader = new FileReader();
    
    if (this.fileType === 'csv') {
      reader.onload = (e: any) => {
        const text = e.target.result;
        this.parseCSV(text);
      };
      reader.readAsText(file);
    } else if (this.fileType === 'xml') {
      reader.onload = (e: any) => {
        const text = e.target.result;
        this.parseXML(text);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        this.parseExcelJSON(json);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  parseCSV(text: string): void {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      this.error = 'File must contain headers and at least one data row';
      return;
    }

    const rawHeaders = lines[0].split(',').map(h => h.trim());
    const headers = rawHeaders.map(h => this.normalizeHeader(h));
    
    this.tableColumns = headers.map((header, index) => ({
      key: header,
      label: rawHeaders[index]
    }));
    
    this.previewData = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  }

  parseExcelJSON(data: any[][]): void {
    if (data.length < 2) {
      this.error = 'File must contain headers and at least one data row';
      return;
    }

    const rawHeaders = data[0].map(h => String(h || '').trim());
    const headers = rawHeaders.map(h => this.normalizeHeader(h));
    
    this.tableColumns = headers.map((header, index) => ({
      key: header,
      label: rawHeaders[index]
    }));
    
    this.previewData = data.slice(1).map(row => {
      const rowData: any = {};
      headers.forEach((header, index) => {
        let value = row[index] !== undefined ? String(row[index]) : '';
        
        // Convert gender number to string
        if (header.toLowerCase() === 'gender' && value) {
          value = numberToGender(value);
        }
        
        rowData[header] = value;
      });
      return rowData;
    });
  }

  parseXML(xmlText: string): void {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        this.error = 'Invalid XML format';
        return;
      }
      
      // Try to find Card elements (new format) or row elements (old format)
      let cards = xmlDoc.querySelectorAll('Card');
      if (cards.length === 0) {
        cards = xmlDoc.querySelectorAll('row');
      }
      
      if (cards.length === 0) {
        this.error = 'No data rows found in XML';
        return;
      }
      
      // Get headers from first card/row
      const firstCard = cards[0];
      const childNodes = Array.from(firstCard.children);
      const rawHeaders = childNodes.map(node => node.tagName);
      const headers = rawHeaders.map(h => this.normalizeHeader(h));
      
      this.tableColumns = headers.map((header, index) => ({
        key: header,
        label: rawHeaders[index]
      }));
      
      // Parse all cards/rows
      this.previewData = Array.from(cards).map(card => {
        const rowData: any = {};
        headers.forEach((header, index) => {
          const element = card.children[index];
          let value = element ? element.textContent || '' : '';
          
          // Convert gender number to string
          if (header.toLowerCase() === 'gender' && value) {
            value = numberToGender(value);
          }
          
          rowData[header] = value;
        });
        return rowData;
      });
    } catch (error) {
      this.error = 'Failed to parse XML file';
      console.error('XML parsing error:', error);
    }
  }

  private normalizeHeader(header: string): string {
    return header
      .split(' ')
      .map((word, index) => {
        word = word.trim();
        if (index === 0) {
          return word.charAt(0).toLowerCase() + word.slice(1);
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.fileType = '';
    this.previewData = [];
    this.tableColumns = [];
    this.error = '';
  }

  onImport(): void {
    if (this.selectedFile && this.previewData.length > 0) {
      this.uploading = true;
      this.uploadProgress = 0;
      this.spinnerService.show();

      // Convert normalized data back to CSV format with normalized headers
      const normalizedFile = this.createNormalizedFile();
    
      this.cardservice.importFile(normalizedFile).subscribe({
        next: (res) => {
          this.spinnerService.hide();
          this.uploading = false;
          if (res.isSuccess) {
            this.alertService.showSuccess(res.message_en || 'File imported successfully');
            this.dialogRef.close({ file: this.selectedFile, data: this.previewData });
          } else {
            this.alertService.showError(res.message_en || 'Failed to import file');
          }
        },
        error: () => {
          this.spinnerService.hide();
          this.uploading = false;
          this.alertService.showError('An error occurred while importing the file');
        }
      });
    }
  }

  private createNormalizedFile(): File {
    // Exclude image column as it contains base64 data that backend can't process
    const headers = this.tableColumns
      .filter(col => col.key.toLowerCase() !== 'image')
      .map(col => col.key);
    
    // If original file was Excel, create Excel file
    if (this.fileType === 'xlsx') {
      const exportData = this.previewData.map(row => {
        const rowData: any = {};
        headers.forEach(header => {
          rowData[header] = row[header] || '';
        });
        return rowData;
      });
      
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      // Write to buffer
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Ensure filename ends with .xlsx
      let fileName = this.fileName;
      if (!fileName.toLowerCase().endsWith('.xlsx')) {
        fileName = fileName.replace(/\.[^.]*$/, '') + '.xlsx';
      }
      
      return new File([blob], fileName, { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
    }
    
    // For CSV and XML, create CSV content
    const csvRows = [headers.join(',')];
    
    this.previewData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape values containing commas or quotes
        if (value.toString().includes(',') || value.toString().includes('"')) {
          return `"${value.toString().replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    // Ensure filename ends with .csv
    let fileName = this.fileName;
    if (this.fileType === 'xml') {
      // Convert XML filename to CSV
      fileName = fileName.replace(/\.[^.]*$/, '') + '.csv';
    } else if (!fileName.toLowerCase().endsWith('.csv')) {
      fileName = fileName.replace(/\.[^.]*$/, '') + '.csv';
    }
    
    return new File([blob], fileName, { type: 'text/csv' });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.processFile(file);
    }
  }

  processFile(file: File): void {
    this.error = '';
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xml') {
      this.selectedFile = file;
      this.fileName = file.name;
      this.fileType = fileExtension;
      this.parseFile(file);
    } else {
      this.error = 'Please select a valid CSV (.csv), Excel (.xlsx), or XML (.xml) file';
      this.selectedFile = null;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  downloadCSVTemplate(): void {
    const link = document.createElement('a');
    link.href = '/template/CSV-TEMPLATE.csv';
    link.download = 'CSV-TEMPLATE.csv';
    link.click();
  }

  downloadExcelTemplate(): void {
    const link = document.createElement('a');
    link.href = '/template/EXCELSHEET-TEMPLATE.xlsx';
    link.download = 'EXCELSHEET-TEMPLATE.xlsx';
    link.click();
  }
}
