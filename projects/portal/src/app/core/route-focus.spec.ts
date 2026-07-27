import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RouteFocus } from './route-focus';

describe('RouteFocus', () => {
  let events: Subject<NavigationEnd | NavigationStart>;
  let heading: HTMLHeadingElement;
  let main: HTMLElement;

  function configure(platformId: 'browser' | 'server'): void {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: { events: events.asObservable() },
        },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
  }

  beforeEach(() => {
    vi.useFakeTimers();
    events = new Subject();
    main = document.createElement('main');
    heading = document.createElement('h1');
    main.append(heading);
    document.body.append(main);
  });

  afterEach(() => {
    events.complete();
    main.remove();
    vi.useRealTimers();
  });

  it('focuses the page heading after browser navigation', () => {
    configure('browser');
    const focus = vi.spyOn(heading, 'focus');
    TestBed.inject(RouteFocus).start();

    events.next(new NavigationStart(1, '/docs'));
    vi.runAllTimers();
    expect(focus).not.toHaveBeenCalled();

    events.next(new NavigationEnd(2, '/docs', '/docs'));
    vi.runAllTimers();

    expect(focus).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('does not subscribe or focus during server rendering', () => {
    configure('server');
    const focus = vi.spyOn(heading, 'focus');

    TestBed.inject(RouteFocus).start();
    events.next(new NavigationEnd(1, '/docs', '/docs'));
    vi.runAllTimers();

    expect(events.observed).toBe(false);
    expect(focus).not.toHaveBeenCalled();
  });
});
