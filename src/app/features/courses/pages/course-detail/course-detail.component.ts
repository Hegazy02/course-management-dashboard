import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../services/courses.service';
import { embedUrl, isPlayableUrl, isYouTubeUrl } from '../../../../core/utils/handle-url';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    SkeletonModule,
    TagModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly coursesService = inject(CoursesService);
   readonly sanitizer = inject(DomSanitizer);

  protected readonly course = signal<Course | undefined>(undefined);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  isYouTubeUrl = isYouTubeUrl;
  isPlayableUrl = isPlayableUrl;
  embedUrl = embedUrl;
  protected statusIcon(status: string): string {
    switch (status) {
      case 'Active':
        return 'pi pi-check-circle';
      case 'Draft':
        return 'pi pi-pencil';
      default:
        return 'pi pi-archive';
    }
  }

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
