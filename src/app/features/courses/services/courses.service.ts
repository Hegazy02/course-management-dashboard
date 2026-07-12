import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Course } from '../models/course.model';
import { HttpService, RequestOptions } from '../../../core/services/http.service';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { CourseQuery, CourseRequest } from '../models/course-request.model';
import { QueryParamsBuilder } from '../../../core/utils/query-params-builder';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private http = inject(HttpService);

  private readonly apiUrl = '/courses';

  courses = signal<Course[]>([]);
  page = signal(1);
  pageSize = signal(15);
  totalRecords = signal(0);

  get(query?: CourseQuery, options?: Omit<RequestOptions, 'params'>): Observable<Course[]> {
    const page = query?.page ?? 1;
    const perPage = query?.pageSize ?? this.pageSize();

    const params = new QueryParamsBuilder()
      .set('_page', page)
      .set('_per_page', perPage)
      .build();

    return this.http
      .get<PaginatedResponse<Course>>(this.apiUrl, {
        ...options,
        params,
      })
      .pipe(
        tap((res) => {
          this.courses.set(res.data);
          this.page.set(page);
          this.pageSize.set(perPage);
          this.totalRecords.set(res.items);
        }),
        map((res) => res.data),
      );
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  add(course: CourseRequest, options?: RequestOptions): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course, options);
  }

  update(id: number, course: CourseRequest, options?: RequestOptions): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course, options);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
