import { Component, inject } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { ConfirmationService } from '../../../../core/services/confirmation.service';

@Component({
  selector: 'app-course-list',
  imports: [ButtonDirective],
  standalone: true,
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
})
export class CourseListComponent {
  protected readonly confirmationService = inject(ConfirmationService);
  confirm() {
    this.confirmationService.confirm({
      header: 'Delete Course',
      message: 'This action cannot be undone.',
      accept: () => {
        console.log('Course deleted');
      },
    });
  }
}
