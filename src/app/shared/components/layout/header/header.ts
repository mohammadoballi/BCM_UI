import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../UI/button/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, Button],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  @Input() isSidebarOpen: boolean = true;
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {
    console.log('Header component initialized');
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
