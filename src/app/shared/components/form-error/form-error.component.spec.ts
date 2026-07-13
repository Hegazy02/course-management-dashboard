import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FormErrorComponent } from './form-error.component';

describe('FormErrorComponent', () => {
  let component: FormErrorComponent;
  let fixture: ComponentFixture<FormErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormErrorComponent);
    component = fixture.componentInstance;
  });

  it('should return null when control is valid', () => {
    const control = new FormControl('valid value');
    control.markAsTouched();
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.message).toBeNull();
  });

  it('should return null when control is not touched', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.message).toBeNull();
  });

  it('should show the first error message when control is invalid and touched', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('messages', { required: 'This field is required.' });
    fixture.detectChanges();
    expect(component.message).toBe('This field is required.');
  });

  it('should render the error message in the template', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('messages', { required: 'Required!' });
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Required!');
  });

  it('should render nothing when control is valid', () => {
    const control = new FormControl('ok');
    control.markAsTouched();
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent?.trim()).toBe('');
  });
});
