import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent } from 'primeng/table';

import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { GeneralTableComponent } from '../../../../shared/components/general-table/general-table.component';
import { CourseDialogComponent } from '../../components/course-dialog/course-dialog.component';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../services/courses.service';
import { courseColumns } from './config/course-columns';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [ButtonModule, CourseDialogComponent, GeneralTableComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
})
export class CourseListComponent {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly coursesService = inject(CoursesService);

  protected readonly courseColumns = courseColumns;
  protected readonly courses = this.coursesService.courses;
  protected readonly totalRecords = this.coursesService.totalRecords;
  protected readonly pageSize = this.coursesService.pageSize;

  protected readonly loading = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly selectedCourse = signal<Course | undefined>(undefined);

  private loadCourses(query: { page: number; pageSize: number }): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    this.coursesService
      .get(query)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe();
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    if (this.loading()) {
      return;
    }

    const pageSize = event.rows ?? this.pageSize();
    const page = event.first != null ? Math.floor(event.first / pageSize) + 1 : 1;

    this.loadCourses({
      page,
      pageSize,
    });
  }

  protected openAddDialog(): void {
    this.selectedCourse.set(undefined);
    this.dialogVisible.set(true);
  }

  protected openEditDialog(): void {
    if (this.selectedCourse()) {
      this.dialogVisible.set(true);
    }
  }

  protected selectCourse(course: Course | Course[]): void {
    this.selectedCourse.set(Array.isArray(course) ? (course[0] ?? null) : course);
  }

  protected refreshCourses(): void {
    this.loadCourses({
      page: this.coursesService.page(),
      pageSize: this.coursesService.pageSize(),
    });
  }

  protected confirmDelete(): void {
    const course = this.selectedCourse();
    if (!course) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Delete Course',
      message: `Are you sure you want to delete "${course.courseName}"?`,
      accept: () => {
        this.coursesService
          .delete(course.id, {
            successMessage: 'Course deleted successfully.',
          })
          .subscribe(() => {
            this.selectedCourse.set(undefined);
            this.refreshCourses();
          });
      },
    });
  }
}
