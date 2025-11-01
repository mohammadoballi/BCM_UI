import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './input.html',
  styleUrls: ['./input.css']
})
export class CustomInput {
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
}
