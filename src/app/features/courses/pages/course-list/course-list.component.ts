import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';

import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { GeneralTableComponent } from '../../../../shared/components/general-table/general-table.component';
import { CoursesService } from '../../services/courses.service';
import { courseColumns } from './config/course-columns';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [GeneralTableComponent],
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

  private loadCourses(query: {
    page: number;
    pageSize: number;
  }): void {
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

  confirm(): void {
    this.confirmationService.confirm({
      header: 'Delete Course',
      message: 'This action cannot be undone.',
      accept: () => {},
    });
  }
}
