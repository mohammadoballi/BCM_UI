import { Component } from '@angular/core';
import { Content } from './content/content';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { RouterOutlet } from "@angular/router";
@Component({
  selector: 'app-layout',
  imports: [Content, Footer, Header, Sidebar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  constructor() { }
}
