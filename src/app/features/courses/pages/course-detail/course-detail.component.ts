import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Subject, switchMap } from 'rxjs';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly coursesService = inject(CoursesService);

  protected readonly course = signal<Course | undefined>(undefined);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap
      .pipe(
        switchMap((_) => {
          if (!id) {
            this.error.set('Course ID is missing');
            throw new Error('Course ID is missing');
          }

          this.loading.set(true);
          return this.coursesService.getById(id, {
            showError: true,
            errorMessage: 'Failed to fetch course details. Please try again later.',
          });
        }),
      )
      .subscribe({
        next: (course) => {
          this.course.set(course);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error fetching course details:', error);
          this.loading.set(false);
        },
      });
  }
}
