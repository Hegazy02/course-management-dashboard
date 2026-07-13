import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { Course } from '../models/course.model';
import { CourseRequest } from '../models/course-request.model';
import { CoursesService } from './courses.service';

const mockCourse: Course = {
  id: '1',
  courseName: 'Angular Fundamentals',
  instructorName: 'Sarah Johnson',
  category: 'Frontend',
  duration: 40,
  price: 199.99,
  status: 'Active',
  createdDate: '2025-01-15',
  description: 'Learn Angular',
  thumbnail: 'https://picsum.photos/seed/angular/320/180',
  url: '',
};

const mockPaginated: PaginatedResponse<Course> = {
  first: 1, prev: null, next: null, last: 1, pages: 1, items: 1,
  data: [mockCourse],
};

describe('CoursesService', () => {
  let service: CoursesService;
  let http: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    http = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [CoursesService, { provide: HttpService, useValue: http }],
    });
    service = TestBed.inject(CoursesService);
  });

  it('should fetch paginated courses via get()', () => {
    http.get.mockReturnValue(of(mockPaginated));

    service.get({ page: 1, pageSize: 15 }).subscribe((courses) => {
      expect(courses).toEqual([mockCourse]);
    });

    expect(service.courses()).toEqual([mockCourse]);
    expect(service.page()).toBe(1);
    expect(service.totalRecords()).toBe(1);
    expect(http.get).toHaveBeenCalledWith('/courses', expect.objectContaining({
      params: expect.anything(),
    }));
  });

  it('should fetch a single course via getById()', () => {
    http.get.mockReturnValue(of(mockCourse));

    service.getById('1').subscribe((course) => {
      expect(course).toEqual(mockCourse);
    });

    expect(http.get).toHaveBeenCalledWith('/courses/1', undefined);
  });

  it('should add a course via add()', () => {
    const request: CourseRequest = {
      courseName: 'New Course',
      instructorName: 'Instructor',
      category: 'Frontend',
      duration: 10,
      price: 100,
      status: 'Active',
      thumbnail: 'https://picsum.photos/seed/course/320/180',
    };
    const created = { ...mockCourse, courseName: 'New Course' };
    http.post.mockReturnValue(of(created));

    service.add(request).subscribe((course) => {
      expect(course.courseName).toBe('New Course');
    });

    expect(http.post).toHaveBeenCalledWith('/courses', request, undefined);
  });

  it('should update a course via update()', () => {
    const request: CourseRequest = {
      courseName: 'Updated',
      instructorName: 'Instructor',
      category: 'Backend',
      duration: 20,
      price: 200,
      status: 'Active',
      thumbnail: '',
    };
    const updated = { ...mockCourse, courseName: 'Updated' };
    http.put.mockReturnValue(of(updated));

    service.update('1', request).subscribe((course) => {
      expect(course.courseName).toBe('Updated');
    });

    expect(http.put).toHaveBeenCalledWith('/courses/1', request, undefined);
  });

  it('should delete a course via delete()', () => {
    http.delete.mockReturnValue(of(undefined));

    service.delete('1').subscribe(() => {
      expect(true).toBe(true);
    });

    expect(http.delete).toHaveBeenCalledWith('/courses/1', undefined);
  });

  it('should reset signals with reset()', () => {
    http.get.mockReturnValue(of(mockPaginated));
    service.get({}).subscribe();
    service.reset();
    expect(service.courses()).toEqual([]);
    expect(service.page()).toBe(1);
    expect(service.totalRecords()).toBe(0);
  });
});
