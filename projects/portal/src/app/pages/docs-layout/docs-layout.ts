import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { DOCUMENT_GROUPS, DOCUMENTS, DocumentGroup } from '../../docs/document-registry';

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
  protected readonly documentGroups = DOCUMENT_GROUPS;
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 59.99rem)').pipe(map((result) => result.matches)),
    { initialValue: true },
  );

  protected documentsInGroup(group: DocumentGroup) {
    return this.documents.filter((document) => document.group === group);
  }

  protected toggle(drawer: MatSidenav): void {
    void drawer.toggle();
  }

  protected closeOnHandset(drawer: MatSidenav): void {
    if (this.isHandset()) {
      void drawer.close();
    }
  }
}
