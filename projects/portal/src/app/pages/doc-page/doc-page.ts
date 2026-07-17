import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { DocumentDefinition, DOCUMENTS } from '../../docs/document-registry';

@Component({
  selector: 'app-doc-page',
  imports: [MarkdownComponent, MatButtonModule, RouterLink],
  templateUrl: './doc-page.html',
  styleUrl: './doc-page.css',
})
export class DocPage {
  readonly content = input.required<string>();
  readonly document = input.required<DocumentDefinition>();

  protected readonly markdownBody = computed(() => this.content().replace(/^#\s+[^\n]+\n+/u, ''));
  protected readonly nextDocument = computed(() => {
    const index = DOCUMENTS.findIndex((item) => item.path === this.document().path);
    return index >= 0 ? DOCUMENTS[index + 1] : undefined;
  });
}
