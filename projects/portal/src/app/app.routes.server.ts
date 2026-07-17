import { RenderMode, ServerRoute } from '@angular/ssr';
import { DOCUMENTS } from './docs/document-registry';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs',
    renderMode: RenderMode.Prerender,
  },
  ...DOCUMENTS.map((document): ServerRoute => ({
    path: `docs/${document.path}`,
    renderMode: RenderMode.Prerender,
  })),
  {
    path: '404',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
