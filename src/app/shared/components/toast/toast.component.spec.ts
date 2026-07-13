import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../../core/services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should render nothing when there are no toasts', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent?.trim()).toBe('');
  });

  it('should render toast messages', () => {
    toastService.success('Operation completed!');
    toastService.error('Something went wrong.');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Operation completed!');
    expect(el.textContent).toContain('Something went wrong.');
  });

  it('should remove a toast when the close button is clicked', () => {
    toastService.success('Dismiss me');
    fixture.detectChanges();

    const closeBtn: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
    closeBtn?.click();
    fixture.detectChanges();

    expect(toastService.toasts().length).toBe(0);
  });

  it('should clear all toasts when clear() is called', () => {
    toastService.success('A');
    toastService.error('B');
    toastService.clear();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent?.trim()).toBe('');
  });
});
