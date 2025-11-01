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
    items: SidebarItem[] = [
    {
      item: 'Dashboard',
      icon: 'fa fa-home',
      route: '/dashboard',
    },
    {
      item: 'Users',
      icon: 'fa fa-users',
      route: '/users',
    },
    {
      item: 'Roles',
      icon: 'fa fa-user',
      route: '/roles',
    },
    {
      item: 'Permissions',
      icon: 'fa fa-user',
      route: '/permissions',
    },
    {
      item: 'Settings',
      icon: 'fa fa-cog',
      route: '/settings',
    },
  ];

}
