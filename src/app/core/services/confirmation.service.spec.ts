import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from './confirmation.service';

describe('ConfirmationService', () => {
  let service: ConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationService);
  });

  it('should start with null dialog', () => {
    expect(service.dialog()).toBeNull();
  });

  it('should open dialog with confirm()', () => {
    const accept = () => {};
    service.confirm({ header: 'Delete?', message: 'Are you sure?', accept });
    expect(service.dialog()).toEqual({ header: 'Delete?', message: 'Are you sure?', accept });
  });

  it('should close dialog with close()', () => {
    service.confirm({ header: 'Delete?', message: 'Are you sure?', accept: () => {} });
    service.close();
    expect(service.dialog()).toBeNull();
  });
});
