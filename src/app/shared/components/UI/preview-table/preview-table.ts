import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-preview-table',
  templateUrl: './preview-table.html',
  styleUrls: ['./preview-table.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule
  ],
})
export class PreviewTable {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];

  get displayedColumns(): string[] {
    return this.columns.map(c => c.key);
  }

  isImageColumn(key: string): boolean {
    return key.toLowerCase() === 'image';
  }
}
