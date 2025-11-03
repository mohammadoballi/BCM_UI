import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.html',
  styleUrls: ['./select.css'],
})
export class CustomSelect {
  @Input() label: string = '';
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  @Input() options: { label: string; value: any }[] = [];
}
