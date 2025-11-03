import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-titlebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './titlebar.html',
  styleUrls: ['./titlebar.css'],
})
export class Titlebar {
  @Input() title!: string;  
  @Input() subtitle: string = '';
}
