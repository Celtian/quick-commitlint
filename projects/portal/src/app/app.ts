import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxScrollTopDirective } from 'ngx-scrolltop';
import { RouteFocus } from './core/route-focus';
import { ThemeSelector } from './core/theme-selector/theme-selector';
import { GITHUB_URL } from './site';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatToolbarModule,
    NgxScrollTopDirective,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ThemeSelector,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly githubUrl = GITHUB_URL;
  private readonly routeFocus = inject(RouteFocus);

  constructor() {
    this.routeFocus.start();
  }
}
