import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../../core/services/loader.service';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let loaderService: LoaderService;
  let events$: Subject<any>;

  beforeEach(async () => {
    events$ = new Subject<any>();

    await TestBed.configureTestingModule({
      imports: [LoaderComponent],
      providers: [
        LoaderService,
        { provide: Router, useValue: { events: events$.asObservable() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
    fixture.detectChanges();
  });

  it('should not render overlay when not loading', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent?.trim()).toBe('');
  });

  it('should render overlay when loading', () => {
    loaderService.show('test-req');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Loading...');
  });

  it('should hide overlay when loading completes', () => {
    loaderService.show('test-req');
    fixture.detectChanges();

    loaderService.hide('test-req');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent?.trim()).toBe('');
  });
});
