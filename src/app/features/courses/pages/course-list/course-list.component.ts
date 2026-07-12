import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, fromEvent, Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent } from 'primeng/table';

import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { GeneralTableComponent } from '../../../../shared/components/general-table/general-table.component';
import { CourseDialogComponent } from '../../components/course-dialog/course-dialog.component';
import { Course, CourseStatus } from '../../models/course.model';
import { CoursesService } from '../../services/courses.service';
import { courseColumns } from './config/course-columns';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    ButtonModule,
    CourseDialogComponent,
    FormsModule,
    GeneralTableComponent,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
})
export class CourseListComponent {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly coursesService = inject(CoursesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly courseColumns = courseColumns;
  protected readonly courses = this.coursesService.courses;
  protected readonly totalRecords = this.coursesService.totalRecords;
  protected readonly pageSize = this.coursesService.pageSize;

  protected readonly loading = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly selectedCourse = signal<Course | undefined>(undefined);
  private readonly OFFSET = 260;
  protected readonly tableHeight = signal(this.computeTableHeight());


  private computeTableHeight(): string {
    const height = window.innerHeight - this.OFFSET;
    console.log("hhh",height);
    
    return `${height}px`;
  }

  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<CourseStatus | ''>('');
  protected readonly statusOptions: { label: string; value: CourseStatus | '' }[] = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Archived', value: 'Archived' },
  ];

  private readonly filterChange = new Subject<{ search: string; status: string }>();

  constructor() {
    const params = this.route.snapshot.queryParams;
    this.searchTerm.set((params['search'] as string) ?? '');
    this.statusFilter.set((params['status'] as CourseStatus) ?? '');

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.tableHeight.set(this.computeTableHeight()));

    this.filterChange
      .pipe(
        debounceTime(600),
        distinctUntilChanged((a, b) => a.search === b.search && a.status === b.status),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ search, status }) => {
        this.updateUrl(search, status);
        this.coursesService.reset();
        this.loadCourses({
          page: 1,
          pageSize: this.pageSize(),
          search: search || undefined,
          status: status || undefined,
        });
      });
  }

  private updateUrl(search: string, status: string): void {
    const queryParams: Record<string, string> = {};
    if (search) queryParams['search'] = search;
    if (status) queryParams['status'] = status;
    this.router.navigate([], { queryParams, replaceUrl: true });
  }

  private loadCourses(query: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
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

  protected onFilterChange(): void {
    this.filterChange.next({
      search: this.searchTerm(),
      status: this.statusFilter(),
    });
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
      search: this.searchTerm() || undefined,
      status: this.statusFilter() || undefined,
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

  protected onCellClick(event: { row: Course }): void {
    this.router.navigate(['/course-list', event.row.id]);
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
