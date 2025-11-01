import { Component } from '@angular/core';
import { SidebarItem } from './sidebar-item/sidebar-item';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  imports: [SidebarItem, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor() { }
    items = [
    {
      item: 'Dashboard',
      icon: 'fa fa-home',
      route: '/dashboard',
    },    
    {
      item: 'Card',
      icon: 'fa fa-credit-card',
      route: '/card',
    },
  
  ];

}
