import { Routes } from '@angular/router';
import { DOCUMENTS } from './docs/document-registry';

const defaultDocument = DOCUMENTS[0];

const documentRoutes: Routes = DOCUMENTS.map((document) => ({
  path: document.path,
  title: document.title,
  data: {
    description: document.description,
    document,
  },
  resolve: {
    content: document.load,
  },
  loadComponent: () => import('./pages/doc-page/doc-page').then((module) => module.DocPage),
}));

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Quick Commitlint — Fast native commit message linting',
    data: {
      description:
        'Quick Commitlint is a fast, dependency-free Conventional Commit message linter built with Zig.',
    },
    loadComponent: () => import('./pages/home/home').then((module) => module.Home),
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('./pages/docs-layout/docs-layout').then((module) => module.DocsLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: defaultDocument.title,
        data: {
          description: defaultDocument.description,
          document: defaultDocument,
        },
        resolve: {
          content: defaultDocument.load,
        },
        loadComponent: () => import('./pages/doc-page/doc-page').then((module) => module.DocPage),
      },
      ...documentRoutes,
    ],
  },
  {
    path: '404',
    title: 'Page not found | Quick Commitlint',
    data: {
      description: 'The requested Quick Commitlint documentation page could not be found.',
    },
    loadComponent: () => import('./pages/not-found/not-found').then((module) => module.NotFound),
  },
  {
    path: '**',
    title: 'Page not found | Quick Commitlint',
    data: {
      description: 'The requested Quick Commitlint documentation page could not be found.',
    },
    loadComponent: () => import('./pages/not-found/not-found').then((module) => module.NotFound),
  },
];
