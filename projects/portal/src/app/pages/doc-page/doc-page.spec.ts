import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { DOCUMENTS } from '../../docs/document-registry';
import { DocPage } from './doc-page';

describe('DocPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DocPage],
      providers: [provideMarkdown(), provideRouter([])],
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('renders sanitized Markdown below one semantic page heading', async () => {
    const sanitizerWarning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(DocPage);
    fixture.componentRef.setInput('document', DOCUMENTS[0]);
    fixture.componentRef.setInput(
      'content',
      '# Getting started\n\n## Install\n\nUse `bun add`.\n\n<script>alert("unsafe")</script>',
    );
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent).toContain('Getting started');
    expect(element.querySelector('h2')?.textContent).toContain('Install');
    expect(element.querySelector('script')).toBeNull();
    expect(sanitizerWarning).toHaveBeenCalledWith(
      expect.stringContaining('sanitizing HTML stripped some content'),
    );
  });
});
