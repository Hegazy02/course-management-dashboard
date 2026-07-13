import { TestBed } from '@angular/core/testing';
import { Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;
  let events$: Subject<any>;

  beforeEach(() => {
    events$ = new Subject<any>();
    TestBed.configureTestingModule({
      providers: [
        LoaderService,
        { provide: Router, useValue: { events: events$.asObservable() } },
      ],
    });
    service = TestBed.inject(LoaderService);
  });

  it('should start with loading false', () => {
    expect(service.loading()).toBe(false);
  });

  it('should set loading true when show() is called', () => {
    service.show('req-1');
    expect(service.loading()).toBe(true);
  });

  it('should set loading false when all requests are hidden', () => {
    service.show('req-1');
    service.hide('req-1');
    expect(service.loading()).toBe(false);
  });

  it('should stay loading if one of many requests remains', () => {
    service.show('req-1');
    service.show('req-2');
    service.hide('req-1');
    expect(service.loading()).toBe(true);
  });

  it('should clear all requests with clear()', () => {
    service.show('req-1');
    service.show('req-2');
    service.clear();
    expect(service.loading()).toBe(false);
  });

  it('should clear on NavigationStart', () => {
    service.show('req-1');
    events$.next(new NavigationStart(1, '/courses'));
    expect(service.loading()).toBe(false);
  });
});
