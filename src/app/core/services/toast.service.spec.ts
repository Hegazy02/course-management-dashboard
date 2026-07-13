import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should start with no toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('should add a toast with show()', () => {
    service.show('Hello', 'info', 5000);
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Hello');
    expect(toasts[0].type).toBe('info');
    expect(toasts[0].duration).toBe(5000);
    expect(toasts[0].id).toBeDefined();
  });

  it('should add a success toast', () => {
    service.success('Done!');
    expect(service.toasts()[0].type).toBe('success');
    expect(service.toasts()[0].message).toBe('Done!');
  });

  it('should add an error toast', () => {
    service.error('Failed!');
    expect(service.toasts()[0].type).toBe('error');
  });

  it('should add a warning toast', () => {
    service.warning('Caution!');
    expect(service.toasts()[0].type).toBe('warning');
  });

  it('should add an info toast', () => {
    service.info('FYI');
    expect(service.toasts()[0].type).toBe('info');
  });

  it('should remove a toast by id', () => {
    service.show('One', 'info', 0);
    service.show('Two', 'info', 0);
    const id = service.toasts()[0].id;
    service.remove(id);
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Two');
  });

  it('should clear all toasts', () => {
    service.show('A', 'info', 0);
    service.show('B', 'info', 0);
    service.clear();
    expect(service.toasts()).toEqual([]);
  });
});
