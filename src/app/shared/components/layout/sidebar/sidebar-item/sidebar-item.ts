import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sidebar-item',
  imports: [RouterLink],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
})
export class SidebarItem {
    @Input() item!: string;
    @Input() icon!: string;
    @Input() route!: string;
}
