import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  standalone:false,
  styleUrl: './button.css',
})

export class Button {
    @Input() label!: string;
    @Input() type!: string;
    @Input() disabled!: boolean;
    @Input() class!: string;
    @Input() icon!: string;
}
