import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import * as XLSX from 'xlsx';
import { genderToNumber } from '../../../../core/utils/gender.utils';


@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
})
export class Table {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];

  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() total = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Input() showActions = false;
  @Input() actionButtons: { key: string; label: string }[] = [];
  @Output() action = new EventEmitter<{ action: string; row: any }>();
  @Input() showExport = true;

  get displayedColumns(): string[] {
    const cols = this.columns.map(c => c.key);
    if (this.showActions) cols.push('actions');
    return cols;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event.pageIndex + 1);
    if (event.pageSize !== this.pageSize) {
      this.pageSizeChange.emit(event.pageSize);
    }
  }

  onAction(actionKey: string, row: any) {
    this.action.emit({ action: actionKey, row });
  }

  getActionIcon(actionKey: string): string {
    const iconMap: { [key: string]: string } = {
      'view': 'visibility',
      'edit': 'edit',
      'delete': 'delete',
      'download': 'download',
      'share': 'share',
      'copy': 'content_copy'
    };
    return iconMap[actionKey] || 'more_vert';
  }

  isImageColumn(key: string): boolean {
    return key.toLowerCase() === 'image';
  }

  exportToCSV(): void {
    const csv = this.convertToCSV(this.data);
    this.downloadFile(csv, 'export.csv', 'text/csv');
  }

  exportToExcel(): void {
    const MAX_CELL_LENGTH = 32767;
    
    const exportData = this.data.map(row => {
      const sanitizedRow: any = {};
      this.columns.forEach(col => {
        let value = row[col.key];
        
        if (this.isImageColumn(col.key)) {

          if (value && String(value).length > MAX_CELL_LENGTH) {
            sanitizedRow[col.label] = String(value).substring(0, MAX_CELL_LENGTH - 20) + '...[TRUNCATED]';
          } else {
            sanitizedRow[col.label] = value || '';
          }
          return;
        }
        
        if (col.key.toLowerCase() === 'gender' && value) {
          value = genderToNumber(value);
        }
        
        if (col.key.toLowerCase() === 'address' && value) {
          value = String(value).replace(/,/g, '-');
        }
        
        if (value !== null && value !== undefined) {
          const stringValue = String(value);
          if (stringValue.length > MAX_CELL_LENGTH) {
            value = stringValue.substring(0, MAX_CELL_LENGTH - 20) + '...[TRUNCATED]';
          }
        }
        
        sanitizedRow[col.label] = value !== null && value !== undefined ? value : '';
      });
      return sanitizedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'export.xlsx');
  }

  exportToXML(): void {
    const xml = this.convertToXML(this.data);
    this.downloadFile(xml, 'export.xml', 'application/xml');
  }

  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';

    const headers = this.columns.map(col => col.label);
    const keys = this.columns.map(col => col.key);

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = keys.map(key => {
        let value = row[key];
        
        if (key.toLowerCase() === 'gender' && value) {
          value = genderToNumber(value);
        }
        
        if (key.toLowerCase() === 'address' && value) {
          value = String(value).replace(/,/g, '-');
        }
        
        return this.escapeCSVValue(value);
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  private convertToXML(data: any[]): string {
    if (!data || data.length === 0) return '<?xml version="1.0" encoding="utf-8"?>\n<Cards>\n</Cards>';

    let xml = '<?xml version="1.0" encoding="utf-8"?>\n<Cards>\n';
    
    for (const row of data) {
      xml += '  <Card>\n';
      this.columns.forEach(col => {
        let value = row[col.key];
        
        if (col.key.toLowerCase() === 'gender' && value) {
          value = genderToNumber(value);
        }
        
        const escapedValue = this.escapeXMLValue(value);
        const elementName = this.toPascalCase(col.key);
        xml += `    <${elementName}>${escapedValue}</${elementName}>\n`;
      });
      xml += '  </Card>\n';
    }
    
    xml += '</Cards>';
    return xml;
  }

  private toPascalCase(str: string): string {
    if (str.toLowerCase() === 'image') {
      return 'ImageBase64';
    }
    return str
      .split(/[\s_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private escapeXMLValue(value: any): string {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    return stringValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }
}
