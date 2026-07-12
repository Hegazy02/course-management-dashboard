import { Course, CourseStatus } from './course.model';

export interface CourseRequest {
  description: string;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  thumbnail: string;
}
export interface CourseQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}
