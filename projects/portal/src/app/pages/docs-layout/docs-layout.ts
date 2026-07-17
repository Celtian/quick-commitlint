import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { DOCUMENTS } from '../../docs/document-registry';

@Component({
  selector: 'app-docs-layout',
  imports: [
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './docs-layout.html',
  styleUrl: './docs-layout.css',
})
export class DocsLayout {
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly documents = DOCUMENTS;
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 59.99rem)').pipe(map((result) => result.matches)),
    { initialValue: true },
  );

  protected toggle(drawer: MatSidenav): void {
    void drawer.toggle();
  }

  protected closeOnHandset(drawer: MatSidenav): void {
    if (this.isHandset()) {
      void drawer.close();
    }
  }
}
