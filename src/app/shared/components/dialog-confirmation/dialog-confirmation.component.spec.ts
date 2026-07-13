import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './dialog-confirmation.component';
import { ConfirmationService } from '../../../core/services/confirmation.service';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    confirmationService = TestBed.inject(ConfirmationService);
    fixture.detectChanges();
  });

  it('should render nothing when no dialog is open', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent?.trim()).toBe('');
  });

  it('should render dialog header and message when confirm() is called', () => {
    confirmationService.confirm({
      header: 'Delete Course',
      message: 'Are you sure you want to delete this course?',
      accept: () => {},
    });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Delete Course');
    expect(el.textContent).toContain('Are you sure you want to delete this course?');
  });

  it('should close dialog when Cancel is clicked', () => {
    confirmationService.confirm({
      header: 'Delete Course',
      message: 'Are you sure?',
      accept: () => {},
    });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('button');
    const cancelBtn = Array.from(buttons).find((btn) => btn.textContent?.trim() === 'Cancel');
    expect(cancelBtn).toBeTruthy();
  });
});
