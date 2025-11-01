import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Layout } from "./shared/components/layout/layout";
import { UI_COMPONENTS } from "./shared/components/UI/ui-module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Layout, ...UI_COMPONENTS],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('BCM.Client');

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/home/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
