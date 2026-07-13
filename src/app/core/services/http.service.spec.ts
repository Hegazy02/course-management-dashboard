import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpService } from './http.service';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should perform GET request', () => {
    service.get<{ id: number }>('/api/items').subscribe((res) => expect(res).toEqual({ id: 1 }));
    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1 });
  });

  it('should perform POST with body', () => {
    service.post<{ id: number }>('/api/items', { name: 'test' }).subscribe((res) => expect(res.id).toBe(2));
    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'test' });
    req.flush({ id: 2 });
  });

  it('should perform PUT with body', () => {
    service.put<{ id: number; name: string }>('/api/items/1', { name: 'updated' }).subscribe((res) => expect(res.name).toBe('updated'));
    const req = httpMock.expectOne('/api/items/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'updated' });
    req.flush({ name: 'updated' });
  });

  it('should perform PATCH with body', () => {
    service.patch<{ id: number; name: string }>('/api/items/1', { name: 'patched' }).subscribe((res) => expect(res.name).toBe('patched'));
    const req = httpMock.expectOne('/api/items/1');
    expect(req.request.method).toBe('PATCH');
    req.flush({ name: 'patched' });
  });

  it('should perform DELETE', () => {
    service.delete('/api/items/1').subscribe();
    const req = httpMock.expectOne('/api/items/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
