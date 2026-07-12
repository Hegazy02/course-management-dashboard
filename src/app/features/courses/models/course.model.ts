export type CourseStatus = 'Active' | 'Draft' | 'Archived';

export interface Course {
  id: string;
  description: string;
  courseName: string;
  instructorName: string;
  category:  string;
  duration: number;
  price: number;
  status: CourseStatus;
  createdDate: string;
  thumbnail: string;
  url: string;
}