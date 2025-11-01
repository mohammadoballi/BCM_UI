import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../UI/button/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
