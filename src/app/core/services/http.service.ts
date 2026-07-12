import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SHOW_ERROR, SHOW_LOADER, SUCCESS_MESSAGE, ERROR_MESSAGE } from '../tokens/http-context.tokens';

export interface RequestOptions {
  params?: HttpParams | Record<string, any>;
  context?: HttpContext;

  showLoader?: boolean;
  showError?: boolean;

  successMessage?: string;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(url, this.createOptions(options));
  }

  post<T>(url: string, body?: unknown, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(url, body, this.createOptions(options));
  }

  put<T>(url: string, body?: unknown, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(url, body, this.createOptions(options));
  }

  patch<T>(url: string, body?: unknown, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(url, body, this.createOptions(options));
  }

  delete<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(url, this.createOptions(options));
  }

  private createOptions(options?: RequestOptions) {
    let context = options?.context ?? new HttpContext();

    context = context
      .set(SHOW_LOADER, options?.showLoader ?? true)
      .set(SHOW_ERROR, options?.showError ?? true)
      .set(SUCCESS_MESSAGE, options?.successMessage ?? null)
      .set(ERROR_MESSAGE, options?.errorMessage ?? null);

    let params = options?.params;
    if (params && !(params instanceof HttpParams)) {
      const cleaned: Record<string, any> = {};
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          cleaned[key] = value;
        }
      }
      params = cleaned;
    }

    return {
      params,
      context,
    };
  }
}
