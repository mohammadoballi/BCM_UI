import { Router } from '@angular/router';
import { Component, Input, inject } from '@angular/core';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  templateUrl: './sidebar-item.html',
  styleUrls: ['./sidebar-item.css'],
})
export class SidebarItem {
  @Input() item!: string;
  @Input() icon!: string;
  @Input() route!: string;

  private router = inject(Router);

  changeRoute(route: string) {
    console.log("this.route", this.route);
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
