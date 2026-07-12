import {
  Component,
  computed,
  inject,
  input,
  model,
  OnChanges,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';

import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { Course, CourseStatus } from '../../models/course.model';
import { CourseRequest } from '../../models/course-request.model';
import { CoursesService } from '../../services/courses.service';

export const COURSE_CATEGORIES = [
  'Frontend',
  'Backend',
  'Data Science',
  'DevOps',
  'Mobile',
  'QA',
  'Security',
  'Management',
  'Hardware',
] as const;

const COURSE_STATUSES: CourseStatus[] = ['Active', 'Draft', 'Archived'];

@Component({
  selector: 'app-course-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    FormErrorComponent,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './course-dialog.component.html',
})
export class CourseDialogComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);
  private readonly coursesService = inject(CoursesService);

  readonly visible = model(false);
  readonly course = input<Course | undefined>(undefined);
  readonly saved = output<void>();

  protected readonly categories = [...COURSE_CATEGORIES];
  protected readonly statuses = COURSE_STATUSES;
  protected readonly saving = signal(false);
  protected readonly title = computed(() => (this.course() ? 'Edit Course' : 'Add Course'));
  protected readonly submitLabel = computed(() => (this.course() ? 'Save Changes' : 'Add Course'));

  protected readonly validationMessages = {
    courseName: {
      required: 'Course name is required.',
      minlength: 'Course name must be at least 3 characters.',
    },
    instructorName: { required: 'Instructor name is required.' },
    category: { required: 'Category is required.' },
    duration: {
      required: 'Duration is required.',
      min: 'Duration must be greater than 0.',
    },
    price: {
      required: 'Price is required.',
      min: 'Price must be 0 or greater.',
    },
    status: { required: 'Status is required.' },
    description: { maxlength: 'Description cannot exceed 500 characters.' },
    url: { maxlength: 'URL cannot exceed 500 characters.' },
  };

  protected readonly courseForm = this.formBuilder.group({
    courseName: this.formBuilder.control<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    instructorName: this.formBuilder.control<string | null>(null, Validators.required),
    category: this.formBuilder.control<string | null>(null, Validators.required),
    duration: this.formBuilder.control<number>(0, [Validators.required, Validators.min(1)]),
    price: this.formBuilder.control<number>(0, [Validators.required, Validators.min(0)]),
    status: this.formBuilder.control<CourseStatus | null>(null, Validators.required),
    description: this.formBuilder.control<string | null>(null, Validators.maxLength(500)),
    url: this.formBuilder.control<string | null>(null, Validators.maxLength(500)),
  });

  ngOnChanges(): void {
    if (this.visible()) {
      this.setFormValues(this.course());
    }
  }

  protected save(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.courseForm.markAllAsDirty();

      return;
    }

    const request = this.toCourseRequest();
    const existingCourse = this.course();
    const saveRequest = existingCourse
      ? this.coursesService.update(existingCourse.id, request, {
          successMessage: 'Course updated successfully.',
        })
      : this.coursesService.add(request, { successMessage: 'Course added successfully.' });

    this.saving.set(true);
    saveRequest.pipe(finalize(() => this.saving.set(false))).subscribe(() => {
      this.saved.emit();
      this.close();
    });
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected resetForm(): void {
    this.courseForm.reset();
  }

  private setFormValues(course: Course | undefined): void {
    this.courseForm.reset({
      courseName: course?.courseName ?? null,
      instructorName: course?.instructorName ?? null,
      category: course?.category ?? null,
      duration: course?.duration ?? 0,
      price: course?.price ?? 0,
      status: course?.status ?? null,
      description: course?.description ?? null,
      url: course?.url ?? null,
    });
  }

  private toCourseRequest(): CourseRequest {
    const formValue = this.courseForm.getRawValue();

    return {
      category: formValue.category as string,
      courseName: formValue.courseName as string,
      description: formValue.description,
      duration: formValue.duration as number,
      instructorName: formValue.instructorName as string,
      price: formValue.price as number,
      status: formValue.status as CourseStatus,
      thumbnail: this.course()?.thumbnail ?? 'https://picsum.photos/seed/course/320/180',
      url: formValue.url,
    };
  }
}
