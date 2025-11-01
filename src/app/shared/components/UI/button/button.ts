import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  standalone:true,
  styleUrl: './button.css',
  imports: [CommonModule],
})

export class Button {
    @Input() label!: string;
    @Input() type!: string;
    @Input() disabled!: boolean;
    @Input() class!: string;
    @Input() icon!: string;
}
